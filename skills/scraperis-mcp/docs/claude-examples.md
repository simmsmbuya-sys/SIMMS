# Claude Implementation Examples

## Basic Web Scraping Flow

Here's how to implement the web scraping flow using our API:

```typescript
async function webScrape(apiKey: string, prompt: string) {
  // 1. Create a scraper job
  const createResponse = await fetch("https://api.scraper.is/api/create_scraper_job", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
  });
  
  const createData = await createResponse.json();
  if (createData.error) {
    throw new Error(createData.error);
  }
  
  const scraperId = createData.scraper_id;
  
  // 2. Poll for results
  while (true) {
    const checkResponse = await fetch(`https://api.scraper.is/api/check_scraper?scraper_id=${scraperId}`, {
      headers: {
        "x-api-key": apiKey
      }
    });
    
    const checkData = await checkResponse.json();
    
    if (checkData.error) {
      throw new Error(checkData.error);
    }
    
    if (checkData.status === "completed") {
      return checkData.result;
    }
    
    if (checkData.status === "failed") {
      throw new Error(checkData.systemMessage);
    }
    
    // Wait 3 seconds before polling again
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

// Example usage:
try {
  const result = await webScrape(
    "YOUR_API_KEY",
    "Get me product information from https://example.com"
  );
  console.log("Scraping result:", result);
} catch (error) {
  console.error("Scraping failed:", error.message);
}
```

## Error Handling Examples

```typescript
// Handle insufficient credits
if (error.message === "Not enough credits") {
  console.log("Please purchase more credits to continue scraping");
  // Optionally redirect to /dashboard/account
}

// Handle invalid API key
if (error.message === "API Key not provided" || error.message === "API Key not found") {
  console.log("Please provide a valid API key");
}

// Handle invalid URL
if (error.message === "Prompt does not contain a URL") {
  console.log("Please include a valid URL in your prompt");
}
```

## Common Prompts

Here are some example prompts that work well with the API:

```typescript
const examplePrompts = [
  // E-commerce product extraction
  "Get me the top 20 products with title, price, and description from https://example-store.com/products",
  
  // News article extraction
  "Extract the latest 10 news articles with headline, date, and summary from https://example-news.com",
  
  // Job listing extraction
  "Find the first 15 job listings with title, company, and salary from https://example-jobs.com/search",
  
  // Real estate listing extraction
  "Get me 25 property listings with price, location, and features from https://example-realty.com"
];
```

## Best Practices

1. **Error Handling**
   - Always implement proper error handling
   - Check for specific error types and handle them appropriately
   - Provide user-friendly error messages

2. **Rate Limiting**
   - Implement exponential backoff for polling
   - Don't poll more frequently than every 3 seconds
   - Handle rate limit errors gracefully

3. **Credit Management**
   - Check credit balance before making requests
   - Implement proper error handling for insufficient credits
   - Consider implementing credit warnings

4. **Prompt Construction**
   - Always include a valid URL in the prompt
   - Be specific about what data to extract
   - Specify the number of items to extract

5. **Response Processing**
   - Handle null values in responses
   - Validate response data before using it
   - Implement proper type checking

## Type Definitions

```typescript
interface ScraperResponse {
  status: "in-progress" | "completed" | "failed";
  systemMessage: string;
  title: string | null;
  summary: any | null;
  result: any | null;
}

interface ErrorResponse {
  error: string;
  toastComponent?: {
    type: string;
    message: string;
    link?: {
      text: string;
      url: string;
    }
  }
}
``` 