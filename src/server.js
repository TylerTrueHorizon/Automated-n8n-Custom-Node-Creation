const express = require('express');
const bodyParser = require('body-parser');
const { generateNode } = require('./generator');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, '../public')));

app.post('/generate', async (req, res) => {
  try {
    const { spec, nodeName, apiPath, method } = req.body;
    if (!spec || !nodeName || !apiPath || !method) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const outPath = await generateNode(spec, apiPath, method.toLowerCase(), nodeName);
    const code = await fs.readFile(outPath, 'utf8');
    res.json({ file: outPath, code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
