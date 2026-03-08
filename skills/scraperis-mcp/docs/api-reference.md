# API Reference

## Authentication

All API endpoints require authentication using an API key. Include your API key in the request headers:

```bash
x-api-key: YOUR_API_KEY
```

## Endpoints

### Create Scraper Job

Creates a new web scraping job.

```http
POST /api/create_scraper_job
```

#### Request Headers
- `x-api-key`: Your API key (required)
- `Content-Type: application/json`

#### Request Body
```json
{
  "prompt": "string" // Must contain a valid URL
}
```

#### Response

##### Success Response (200)
```json
{
  "scraper_id": "string",
  "url": "string"
}
```

##### Error Responses
- `401` - API Key not provided or invalid
```json
{
  "error": "API Key not provided" | "API Key not found"
}
```

- `400` - Insufficient credits
```json
{
  "error": "Not enough credits",
  "toastComponent": {
    "type": "error",
    "message": "Sorry, credits are not enough.",
    "link": {
      "text": "Please click here to add more credits",
      "url": "/dashboard/account"
    }
  }
}
```

- `500` - Other errors
```json
{
  "error": "Prompt does not contain a URL" | "Error creating scraper" | "Cannot find url" | "Error fetching data"
}
```

### Check Scraper Status

Check the status of a scraping job.

```http
GET /api/check_scraper
```

#### Request Headers
- `x-api-key`: Your API key (required)

#### Query Parameters
- `scraper_id`: ID of the scraper job to check

#### Response

##### Success Response (200)
```json
{
  "status": "in-progress" | "completed" | "failed",
  "systemMessage": "string",
  "title": "string | null",
  "summary": "object | null",
  "result": "object | null"
}
```

##### Error Responses
- `500` - Various errors
```json
{
  "error": "API Key not provided" | "API Key not found" | "Scraper ID not provided" | "error.message"
}
```

- `404` - Scraper not found
```json
{
  "error": "No runner found"
}
```

### Check Job Status

Check the status of a specific job.

```http
GET /api/check_job
```

#### Request Headers
- `Authorization`: Bearer token for user authentication
- `Content-Type: application/json`

#### Query Parameters
- `jobId`: ID of the job to check

#### Response

##### Success Response (200)
```json
{
  "status": "string",
  "result": "object | null"
}
```

##### Error Response (200 with error)
```json
{
  "error": "Insufficient credits"
}
```

## Usage Example

Here's an example of how to use the API with cURL:

```bash
# 1. Create a new scraper job
curl -X POST "https://api.scraper.is/create_scraper_job" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Get me product information from https://example.com"}'

# 2. Check scraper status
curl "https://api.scraper.is/check_scraper?scraper_id=YOUR_SCRAPER_ID" \
  -H "x-api-key: YOUR_API_KEY"

# 3. Check job status
curl "https://api.scraper.is/check_job?jobId=YOUR_JOB_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Rate Limits and Credits

- Each successful scraping operation consumes 1 credit
- Operations will fail if the user has insufficient credits
- Users can check their credit balance in the dashboard
- Credits can be added through the account page (/dashboard/account)

## Error Handling

The API uses standard HTTP status codes:
- `200`: Success
- `400`: Bad Request (e.g., insufficient credits)
- `401`: Unauthorized (invalid or missing API key)
- `404`: Not Found
- `500`: Server Error

Error responses always include an `error` field with a descriptive message. 