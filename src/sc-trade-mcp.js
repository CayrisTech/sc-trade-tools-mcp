/**
 * Star Citizen Trade Tools MCP - Finds best places to sell items in Star Citizen
 * @param {Object} input - The input from the user
 * @param {string} input.itemName - The name of the item to sell
 * @param {number} [input.quantity=1] - The quantity in SCU
 * @returns {Object} - The MCP response
 */
const puppeteer = require('puppeteer');

async function scTradeMCP(input) {
    // Validate input
    const { itemName, quantity = 1 } = input;
    
    if (!itemName) {
      return {
        error: "missing_item_name",
        message: "Please provide the name of the item you want to sell."
      };
    }
    
    if (isNaN(quantity) || quantity < 0) {
      return {
        error: "invalid_quantity",
        message: "Quantity must be a positive number."
      };
    }
    
    let browser;
    
    try {
      // Create the query object for SC Trade Tools
      const queryObject = {
        itemName: itemName,
        itemQuantityInScu: quantity
      };
      
      // Encode the query object
      const encodedQuery = encodeURIComponent(JSON.stringify(queryObject));
      
      // Construct the direct URL
      const directUrl = `https://sc-trade.tools/best-buyer?q=${encodedQuery}`;
      
      // Launch a headless browser
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      
      // Navigate directly to the URL with query parameters
      await page.goto(directUrl, {
        waitUntil: 'networkidle2',
        timeout: 60000
      });
      
      // Wait for the page to fully load
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Check if the page indicates "no results found"
      const hasNoResults = await page.evaluate(() => {
        return document.body.textContent.includes('No results found') || 
               document.body.textContent.includes('No matching records found');
      });
      
      if (hasNoResults) {
        return {
          error: "item_not_found",
          message: `I couldn't find any places to sell "${itemName}". Please verify that this is a valid commodity in Star Citizen.`
        };
      }
      
      // Extract the results
      const results = await page.evaluate(() => {
        // Find elements that look like shop entries
        const shopEntries = Array.from(document.querySelectorAll('table tr, div.row'))
          .filter(el => 
            !el.querySelector('th') && 
            el.textContent.includes('UEC') && 
            !el.textContent.includes('Use the filters to see different results')
          );
        
        // Get only unique entries
        const uniqueEntries = [];
        const seenTexts = new Set();
        
        for (const entry of shopEntries) {
          const trimmedText = entry.textContent.trim();
          if (trimmedText.length < 5 || seenTexts.has(trimmedText)) continue;
          
          seenTexts.add(trimmedText);
          uniqueEntries.push(entry);
          
          if (uniqueEntries.length === 3) break;
        }
        
        // Parse each unique entry
        return uniqueEntries.map(entry => {
          const text = entry.textContent.trim();
          
          // Extract price
          const uecMatch = text.match(/(\d+)\s*UEC/);
          const price = uecMatch ? uecMatch[1] : null;
          
          // Remove the price part to isolate the location
          const locationText = text.replace(/¤\d+\s*UEC/, '').trim();
          
          // Parse location components
          const locationMatch = locationText.match(/^(.*?)\s+(Stanton|Pyro)(?:\s+>\s+(.+))?$/);
          
          let shop = '';
          let system = '';
          let location = '';
          
          if (locationMatch) {
            shop = locationMatch[1].trim();
            system = locationMatch[2];
            location = locationMatch[3] || '';
          } else {
            shop = locationText;
          }
          
          // Extract container sizes
          const containerSizes = [];
          const sizeElements = entry.querySelectorAll('.btn, [class*="size"]');
          sizeElements.forEach(el => {
            const size = parseInt(el.textContent.trim());
            if (!isNaN(size) && !containerSizes.includes(size)) {
              containerSizes.push(size);
            }
          });
          
          return {
            shop: shop,
            system: system,
            location: location,
            price: price ? parseInt(price) : 0,
            containerSizes: containerSizes.length > 0 ? containerSizes : [1, 2, 4, 8, 16, 32]
          };
        });
      });
      
      if (results.length === 0) {
        return {
          error: "parsing_error",
          message: `I found the page for "${itemName}", but couldn't extract the sell locations. Please try again.`
        };
      }
      
      // Format the results
      const topSellLocations = results.map(result => ({
        shop: result.shop,
        system: result.system,
        location: result.location,
        price: result.price,
        containerSizes: result.containerSizes
      }));
      
      // Build the response message
      const messageLines = topSellLocations.map((loc, i) => {
        const locationText = loc.system ? 
          `${loc.system}${loc.location ? ` > ${loc.location}` : ''}` : '';
        
        return `${i+1}. ${loc.shop}${locationText ? ` (${locationText})` : ''} - ${loc.price} UEC`;
      });
      
      // Calculate total profit
      const totalProfit = topSellLocations[0].price * quantity;
      
      return {
        item: itemName,
        quantity: quantity,
        bestSellLocations: topSellLocations,
        totalProfit: totalProfit,
        message: `Here are the top ${topSellLocations.length} places to sell ${quantity} SCU of ${itemName}:\n${messageLines.join('\n')}`,
        containerSizeOptions: topSellLocations[0].containerSizes
      };
      
    } catch (error) {
      // Handle specific error types
      if (error.name === 'TimeoutError') {
        return {
          error: "timeout_error",
          message: `The request timed out while searching for "${itemName}". The SC Trade Tools website might be slow or unavailable.`
        };
      }
      
      if (error.message.includes('Navigation failed')) {
        return {
          error: "navigation_error",
          message: "Couldn't connect to SC Trade Tools. Please check your internet connection and try again."
        };
      }
      
      // Generic error handler
      return {
        error: "unknown_error",
        message: `I couldn't find the best places to sell ${itemName}. Please check if the item name is correct or try again later.`,
        details: error.message
      };
    } finally {
      // Close the browser
      if (browser) {
        await browser.close();
      }
    }
}

module.exports = scTradeMCP;