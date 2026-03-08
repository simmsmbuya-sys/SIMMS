# MCP Server for Scraper.is
[![smithery badge](https://smithery.ai/badge/@scraperis/scraperis-mcp)](https://smithery.ai/server/@scraperis/scraperis-mcp)

The scraper tool is an asynchronous utility that leverages the Scraper.is API to fetch and process content from websites using natural language prompts. This tool is designed to handle various scraping scenarios efficiently, allowing you to specify exactly what data you want to extract in plain English.

## Key Features

1. **Natural Language Scraping**
    - Extract data from websites using plain English prompts
    - Automatically identifies URLs and extraction requirements from your prompts
    - Supports complex queries like filtering by price, ratings, dates, etc.

2. **Smart Data Parsing**
    - Returns structured data in JSON format when specific data points are requested
    - If parsing is disabled, converts the content into clean, readable Markdown
    - Handles various data types: text, numbers, dates, prices, etc.

## Examples on how to query Claude or other LLM
- "Get me the top 10 products from producthunt.com"
- "Find all products under $50 with 4+ star ratings on amazon.com/deals"
- "Extract all article titles and authors from techcrunch.com/ai"
- "Get the latest job postings from ycombinator.com/jobs"
- "Collect user reviews from the first 3 pages of trustpilot.com/company/apple"

## Prerequisites
### Install uv first.
https://docs.astral.sh/uv/getting-started/installation/#installation-methods

## Setup Instructions

### Installing via Smithery

To install Scraper.is MCP server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@scraperis/scraperis-mcp):

```bash
npx -y @smithery/cli install @scraperis/scraperis-mcp --client claude
```

### Setup with Claude Desktop
```json
# claude_desktop_config.json
# Can find location through:
# Claude -> Settings -> Developer -> Edit Config
{
  "mcpServers": {
    "scraperis_scraper": {
      "command": "uvx",
      "args": ["scraperis-mcp"],
      "env": {
        "SCRAPERIS_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

## Local/Dev Setup Instructions
### Clone repo
`git clone <git:url>`
### Install dependencies
Install MCP server dependencies:
```bash
cd mcp-server-scraperis

# Create virtual environment and activate it
uv venv

source .venv/bin/activate # MacOS/Linux
# OR
.venv/Scripts/activate # Windows

# Install dependencies
uv sync
```
### Setup with Claude Desktop
```json
# claude_desktop_config.json
# Can find location through:
# Claude -> Settings -> Developer -> Edit Config
{
  "mcpServers": {
    "scraperis_scraper": {
      "command": "uv",
      "args": [
        "--directory",
        "/<Absolute-path-to-folder>/scraperis-mcp",
        "run",
        "scraperis-mcp"
      ],
      "env": {
        "SCRAPERIS_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

### Debugging
Run:
```bash
make run
```
Then access MCP Inspector at `http://localhost:5173`. You may need to add your API key in the environment variables in the inspector under `SCRAPERIS_API_KEY`.

## Rate Limits and Credits

- Each successful scraping operation consumes 1 credit
- Operations will fail if the user has insufficient credits
- Users can check their credit balance in the dashboard
- Credits can be added through the account page (/dashboard/account)

## License

This project is licensed under the [MIT License](LICENSE).

## About Scraper.is

Scraper.is is a powerful web scraping API service that provides reliable and efficient data extraction capabilities for businesses and developers. With features like automatic proxy rotation, JavaScript rendering, and intelligent parsing, it helps you collect the data you need from any website.