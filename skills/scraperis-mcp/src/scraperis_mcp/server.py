from typing import Annotated, Any, Literal
from httpx import AsyncClient, Timeout, HTTPStatusError, RequestError
from mcp.server.fastmcp import FastMCP
from dotenv import load_dotenv
from pydantic import Field
import asyncio

from scraperis_mcp.utils import convert_html_to_md, get_auth_from_env, strip_html

SCRAPERIS_API_URL = "https://api.scraper.is/api"
REQUEST_TIMEOUT = 100

mcp = FastMCP("scraperis_mcp", dependencies=["mcp", "httpx"])
load_dotenv()


@mcp.tool(
    name="scraperis_scraper",
    description="Extract data from websites using natural language prompts. "
    "The prompt should include the website URL and what data you want to extract. "
    "For example: 'Get me the top 10 products from producthunt.com' or "
    "'Extract all article titles and authors from techcrunch.com/news'"
)
async def scrape_url(
    prompt: Annotated[
        str,
        Field(
            description="Natural language prompt describing what to extract and from where. "
            "For example: 'Get me the top 10 products from producthunt.com' or "
            "'Find all articles about AI from techcrunch.com'"
        )
    ],
    parse: Annotated[
        bool | None,
        Field(
            description="Should result be parsed. "
            "If result should not be parsed then html "
            "will be stripped and converted to markdown file"
        )
    ] = None
) -> str:
    """Extract data from websites using natural language prompts"""
    api_key = get_auth_from_env()

    async with AsyncClient(
        timeout=Timeout(REQUEST_TIMEOUT),
        headers={"x-api-key": api_key}
    ) as client:
        try:
            # Create scraper job with the natural language prompt
            create_response = await client.post(
                f"{SCRAPERIS_API_URL}/create_scraper_job",
                json={"prompt": prompt}
            )
            create_response.raise_for_status()
            create_data = create_response.json()
            
            if "error" in create_data:
                return f"Error creating scraper job: {create_data['error']}"
            
            scraper_id = create_data["scraper_id"]
            
            # Poll for results
            while True:
                check_response = await client.get(
                    f"{SCRAPERIS_API_URL}/check_scraper",
                    params={"scraper_id": scraper_id}
                )
                check_response.raise_for_status()
                check_data = check_response.json()
                
                if "error" in check_data:
                    return f"Error checking scraper status: {check_data['error']}"
                
                if check_data["status"] == "completed":
                    content = check_data["result"]
                    if not bool(parse):
                        stripped_html = strip_html(str(content))
                        return convert_html_to_md(stripped_html)
                    return str(content)
                
                if check_data["status"] == "failed":
                    return f"Scraping failed: {check_data.get('systemMessage', 'Unknown error')}"
                
                # Wait before polling again
                await asyncio.sleep(3)
                
        except HTTPStatusError as e:
            return f"HTTP error: {e.response.status_code} - {e.response.text}"
        except RequestError as e:
            return f"Request error: {e}"
        except Exception as e:
            return f"Error: {str(e) or repr(e)}"


def main():
    mcp.run()


if __name__ == "__main__":
    main()
