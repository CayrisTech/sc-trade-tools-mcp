# Star Citizen Trade Finder MCP

An MCP (Model Call Panel) for finding the best places to sell items in Star Citizen, powered by [SC Trade Tools](https://sc-trade.tools/).

## Features

- Find the top 3 places to sell any commodity in Star Citizen
- Get accurate pricing information for each location
- See available container sizes
- Calculate total profit for your cargo

## Installation

```bash
npm install sc-trade-tools-mcp
```

## Usage

```javascript
const scTradeMCP = require('sc-trade-tools-mcp');

// Example: Find where to sell Quartz
async function findBestSellLocations() {
  const result = await scTradeMCP({ 
    itemName: 'Quartz', 
    quantity: 1 
  });
  
  console.log(result.message);
  // Output: Here are the top 3 places to sell 1 SCU of Quartz:
  // 1. Seraphim Station (Stanton > Crusader) - 398 UEC
  // 2. Magnus Gateway (Stanton) - 398 UEC
  // 3. Stanton Gateway (Pyro) - 398 UEC
}

findBestSellLocations();
```

## Response Format

The MCP returns an object with the following structure:

```javascript
{
  "item": "Quartz",
  "quantity": 1,
  "bestSellLocations": [
    {
      "shop": "Seraphim Station",
      "system": "Stanton",
      "location": "Crusader",
      "price": 398,
      "containerSizes": [1, 2, 4, 8, 16, 32]
    },
    // ... more locations
  ],
  "totalProfit": 398,
  "message": "Here are the top 3 places to sell 1 SCU of Quartz:\n1. Seraphim Station (Stanton > Crusader) - 398 UEC\n2. Magnus Gateway (Stanton) - 398 UEC\n3. Stanton Gateway (Pyro) - 398 UEC",
  "containerSizeOptions": [1, 2, 4, 8, 16, 32]
}
```

## Requirements

- Node.js 14+
- Puppeteer (installed automatically)

## Integration with MCPs

To integrate with an MCP framework, import the function and call it with the user's input.

```javascript
// Example MCP integration
async function myMCPHandler(userInput) {
  // Parse the commodity name from the user input
  const itemName = extractItemName(userInput);
  
  // Call the SC Trade Tools MCP
  const result = await scTradeMCP({ 
    itemName: itemName, 
    quantity: 1 
  });
  
  // Return the result
  return result;
}
```

## Error Handling

The MCP provides detailed error information for various scenarios:

```javascript
// Example error response for an invalid item
{
  "error": "item_not_found",
  "message": "I couldn't find any places to sell \"InvalidItem\". Please verify that this is a valid commodity in Star Citizen."
}

// Example error response for connection issues
{
  "error": "navigation_error",
  "message": "Couldn't connect to SC Trade Tools. Please check your internet connection and try again."
}
```

## How It Works

This MCP uses Puppeteer to query the SC Trade Tools website and extract the best selling locations for any commodity. It:

1. Takes the item name and quantity as input
2. Constructs a query URL for SC Trade Tools
3. Uses a headless browser to fetch and parse the results
4. Extracts and formats the top 3 selling locations
5. Returns a structured response with all relevant information

## Common Commodities

Some common Star Citizen commodities you can query:

- Titanium
- Quartz 
- Laranite
- Diamond
- Gold
- Agricium
- Medical Supplies
- Aluminum
- Beryl
- Copper

## Credits

- This MCP uses data from [SC Trade Tools](https://sc-trade.tools/)
- Star Citizen is a trademark of Cloud Imperium Rights LLC

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.
