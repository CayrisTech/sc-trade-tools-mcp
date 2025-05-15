const express = require('express');
const scTradeMCP = require('./index.js');

const app = express();
app.use(express.json());

app.post('/mcp', async (req, res) => {
  const { itemName, quantity } = req.body;
  if (!itemName || typeof quantity !== 'number') {
    return res.status(400).json({ error: 'Missing or invalid itemName or quantity' });
  }
  try {
    const result = await scTradeMCP({ itemName, quantity });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MCP server running on port ${PORT}`);
}); 