import json
from httpx import Request, Response
import pytest
from mcp.server.fastmcp import FastMCP
from mcp.server.fastmcp.tools.base import ToolError
from mcp.types import TextContent
from scraperis_mcp.server import mcp as mcp_server
from contextlib import nullcontext as does_not_raise
from unittest.mock import AsyncMock, patch


ENV_VARIABLES = {'SCRAPERIS_API_KEY': 'test_api_key'}


class TestMcpServer:
    @pytest.fixture
    def mcp(self) -> FastMCP:
        return mcp_server

    @pytest.fixture
    def request_data(self):
        return Request("POST", "https://api.scraper.is/api/create_scraper_job")

    @pytest.mark.parametrize(
        "arguments, expectation, expected_result",
        [
            pytest.param(
                {
                    "prompt": "Get me the top 10 products from producthunt.com"
                },
                does_not_raise(),
                "Mocked content",
                id="basic-prompt"
            ),
            pytest.param(
                {
                    "prompt": "Extract all article titles from techcrunch.com/news",
                    "parse": True
                },
                does_not_raise(),
                "<html><body>Mocked content</body></html>",
                id="prompt-with-parse"
            ),
            pytest.param(
                {
                    "prompt": "Find all products under $50 with 4+ star ratings from amazon.com",
                    "parse": False
                },
                does_not_raise(),
                "Mocked content",
                id="complex-prompt-no-parse"
            ),
            pytest.param(
                {
                    "prompt": "Get the latest news from bbc.com/tech",
                    "parse": "True"
                },
                does_not_raise(),
                "<html><body>Mocked content</body></html>",
                id="prompt-parse-string"
            ),
            pytest.param(
                {},
                pytest.raises(ToolError),
                None,
                id="no-prompt"
            ),
        ]
    )
    @pytest.mark.asyncio
    async def test_scraperis_scraper_arguments(
        self,
        mcp: FastMCP,
        request_data: Request,
        arguments: dict,
        expectation,
        expected_result: str
    ):
        mock_create_response = Response(
            200,
            content=json.dumps({"scraper_id": "test_id"}),
            request=request_data
        )
        
        mock_check_response = Response(
            200,
            content=json.dumps({
                "status": "completed",
                "result": "<html><body>Mocked content</body></html>"
            }),
            request=request_data
        )

        async def validate_post_data(request):
            data = json.loads(request.content)
            assert data.get("prompt") == arguments.get("prompt")
            return mock_create_response

        with (
            expectation,
            patch("os.environ", new=ENV_VARIABLES),
            patch(
                "httpx.AsyncClient.post",
                new=AsyncMock(side_effect=validate_post_data)
            ),
            patch(
                "httpx.AsyncClient.get",
                new=AsyncMock(return_value=mock_check_response)
            ),
            patch("asyncio.sleep", new=AsyncMock())  # Mock sleep to speed up tests
        ):
            result = await mcp.call_tool("scraperis_scraper", arguments=arguments)
            assert result == [TextContent(type="text", text=expected_result)]

    @pytest.mark.parametrize(
        "arguments, create_response, check_response, expected_result",
        [
            pytest.param(
                {
                    "prompt": "Get me the top 10 products from producthunt.com"
                },
                Response(
                    200,
                    content=json.dumps({"scraper_id": "test_id"})
                ),
                Response(
                    200,
                    content=json.dumps({
                        "status": "completed",
                        "result": [
                            {
                                "name": "Product 1",
                                "description": "Description 1",
                                "votes": 100
                            },
                            {
                                "name": "Product 2",
                                "description": "Description 2",
                                "votes": 90
                            }
                        ]
                    })
                ),
                str([
                    {
                        "name": "Product 1",
                        "description": "Description 1",
                        "votes": 100
                    },
                    {
                        "name": "Product 2",
                        "description": "Description 2",
                        "votes": 90
                    }
                ]),
                id="structured-result"
            ),
            pytest.param(
                {
                    "prompt": "Extract all article titles from techcrunch.com"
                },
                Response(
                    200,
                    content=json.dumps({"scraper_id": "test_id"})
                ),
                Response(
                    200,
                    content=json.dumps({
                        "status": "completed",
                        "result": "<html><body>Mocked content</body></html>"
                    })
                ),
                "Mocked content",
                id="successful-scrape"
            ),
            pytest.param(
                {
                    "prompt": "Get product details from amazon.com/invalid"
                },
                Response(
                    200,
                    content=json.dumps({"scraper_id": "test_id"})
                ),
                Response(
                    200,
                    content=json.dumps({
                        "status": "failed",
                        "systemMessage": "Failed to access the URL"
                    })
                ),
                "Scraping failed: Failed to access the URL",
                id="failed-scrape"
            ),
            pytest.param(
                {
                    "prompt": "Get data from restricted.com"
                },
                Response(
                    403,
                    content=json.dumps({"error": "Invalid API key"})
                ),
                None,
                'HTTP error: 403 - {"error": "Invalid API key"}',
                id="invalid-api-key"
            ),
            pytest.param(
                {
                    "prompt": "Scrape large-site.com"
                },
                Response(
                    200,
                    content=json.dumps({"error": "Not enough credits"})
                ),
                None,
                'Error creating scraper job: Not enough credits',
                id="insufficient-credits"
            )
        ]
    )
    @pytest.mark.asyncio
    async def test_scraperis_scraper_results(
        self,
        mcp: FastMCP,
        request_data: Request,
        arguments: dict,
        create_response: Response,
        check_response: Response | None,
        expected_result: str
    ):
        create_response.request = request_data
        if check_response:
            check_response.request = request_data

        with (
            patch("os.environ", new=ENV_VARIABLES),
            patch(
                "httpx.AsyncClient.post",
                new=AsyncMock(return_value=create_response)
            ),
            patch(
                "httpx.AsyncClient.get",
                new=AsyncMock(return_value=check_response)
            ) if check_response else patch("httpx.AsyncClient.get"),
            patch("asyncio.sleep", new=AsyncMock())  # Mock sleep to speed up tests
        ):
            result = await mcp.call_tool("scraperis_scraper", arguments=arguments)
            assert result == [TextContent(type="text", text=expected_result)]
