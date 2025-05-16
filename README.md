# Star Citizen Trade Finder MCP

A Model Context Protocol (MCP) server for finding the best places to sell items in Star Citizen, powered by [SC Trade Tools](https://sc-trade.tools/).

## For Star Citizen Pilots

**Are you a Star Citizen pilot looking to maximize your trading profits?**

This tool helps you quickly find the best places in the 'verse to sell your cargo. Just tell it what commodity you have (like Quartz, Titanium, or Laranite), and it will instantly tell you the top locations and prices—so you can make the most UEC on every run.

**How to use it:**
- You can connect this tool to [Claude Desktop](https://www.anthropic.com/claude) (AI assistant for Windows), [Cursor](https://www.cursor.so/) (an AI-powered code editor), or any app that supports MCP tools.
- Once set up, just ask: _"Where should I sell Quartz?"_ or _"Best place to sell Titanium?"_—and you'll get the top 3 locations, prices, and profit info.
- If you don't specify a quantity, it assumes 1 SCU (Standard Cargo Unit).

**Quickstart for pilots (Windows, Claude Desktop):**

1. **Install Node.js (if you don't have it):**
   - Go to [nodejs.org](https://nodejs.org/) and download the LTS version for Windows.
   - Install it by following the instructions on the website.

2. **Download this project:**
   - Click the green "Code" button on the GitHub page and choose "Download ZIP".
   - Unzip the folder to a place you can find it (like your Desktop).

3. **Open a terminal:**
   - Press `Win + R`, type `cmd`, and press Enter.

4. **Navigate to the project folder:**
   - In the terminal, type `cd ` (with a space), then drag the unzipped project folder into the terminal window and press Enter.

5. **Install the required packages:**
   - In the terminal, type:
     ```
     npm install
     ```
   - Wait for it to finish (this only needs to be done once).

6. **Find the full path to your `server.js` file:**
   - In your terminal, type:
     ```
     echo %cd%\server.js
     ```
   - Copy the full path that is printed (e.g., `C:\Users\yourname\Desktop\sc-trade-tools-mcp\server.js`).

7. **Edit your Claude Desktop configuration:**
   - Open Claude Desktop.
   - Go to the Claude menu (top left), select **Settings...**
   - Click on **Developer** in the left sidebar, then click **Edit Config**.
   - This will open `%APPDATA%\Claude\claude_desktop_config.json` in your text editor.

8. **Add your MCP server to the config file:**
   - Replace or add to the `"mcpServers"` section like this:
     ```json
     {
       "mcpServers": {
         "star-citizen-trade": {
           "command": "node",
           "args": [
             "C:\\Users\\yourname\\Desktop\\sc-trade-tools-mcp\\server.js"
           ]
         }
       }
     }
     ```
   - Make sure the path matches the one you copied in step 6.

9. **Save the config file and restart Claude Desktop.**

10. **Start your MCP server:**
    - In your terminal, type:
      ```
      node server.js
      ```
    - Leave this terminal window open while you use Claude.

11. **Ask your question in Claude:**
    - Try: _"Where should I sell Quartz?"_ or _"Best place to sell Titanium?"_
    - Claude will reply with the top locations and prices for your cargo!

**Reference:**
- [Model Context Protocol Quickstart for Claude Desktop Users (Windows)](https://modelcontextprotocol.io/quickstart/user#windows)

**That's it! You're ready to make smarter trades in Star Citizen.**

## Features

- Find the top 3 places to sell any commodity in Star Citizen
- Get accurate pricing information for each location
- See available container sizes
- Calculate total profit for your cargo

## Requirements

- Node.js 16+ (ESM required)
- Puppeteer (installed automatically)

## Installation

```bash
npm install
git clone <this-repo-url>
cd sc-trade-tools-mcp
```

## Usage (as an MCP Server)

1. **Start the MCP server:**
   ```bash
   node server.js
   ```
   This will start the MCP server using [fastMCP](https://www.npmjs.com/package/fastmcp) and expose the `findBestSellLocations` tool.

2. **Connect from Cursor, Claude, or any MCP-compatible client:**
   - In Cursor: Go to MCP settings, add a new server, and set the command to:
     ```
     node /absolute/path/to/server.js
     ```
   - The tool will be available as `findBestSellLocations`.

3. **Test directly in Node.js:**
   ```js
   import { scTradeMCP } from './src/sc-trade-mcp.js';
   const result = await scTradeMCP({ itemName: 'Quartz', quantity: 1 });
   console.log(result);
   ```

4. **Run included tests:**
   ```bash
   npm test
   # or
   node example/test.js
   ```

## Response Format

The MCP returns an object with the following structure:

```json
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
    }
    // ... more locations
  ],
  "totalProfit": 398,
  "message": "Here are the top 3 places to sell 1 SCU of Quartz:\n1. Seraphim Station (Stanton > Crusader) - 398 UEC\n2. Magnus Gateway (Stanton) - 398 UEC\n3. Stanton Gateway (Pyro) - 398 UEC",
  "containerSizeOptions": [1, 2, 4, 8, 16, 32]
}
```

## Error Handling

The MCP provides detailed error information for various scenarios:

```json
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

## MCP Inspector / Cursor Integration

- You can use [MCP Inspector](https://github.com/composiohq/mcp-inspector) or Cursor's built-in MCP support to test and interact with this server.
- Add the server as a command-based MCP server:
  ```
  node /absolute/path/to/server.js
  ```
- The tool will be available as `findBestSellLocations`.

## Credits

- This MCP uses data from [SC Trade Tools](https://sc-trade.tools/)
- Star Citizen is a trademark of Cloud Imperium Rights LLC

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.
