import { scTradeMCP } from '../src/sc-trade-mcp.js';

async function runTests() {
  console.log('=== Testing SC Trade Tools MCP ===');
  
  try {
    // Test with Quartz
    console.log('\n--- Testing with Quartz ---');
    const quartzResult = await scTradeMCP({ itemName: 'Quartz', quantity: 1 });
    console.log('\nResult for Quartz:');
    console.log(JSON.stringify(quartzResult, null, 2));
    
    // Test with Titanium
    console.log('\n--- Testing with Titanium ---');
    const titaniumResult = await scTradeMCP({ itemName: 'Titanium', quantity: 1 });
    console.log('\nResult for Titanium:');
    console.log(JSON.stringify(titaniumResult, null, 2));
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTests();
