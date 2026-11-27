const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(__dirname, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.dc.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }
  }
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Dinelabs Manager.dc.html'));
});

app.listen(PORT, () => {
  console.log(`Dinelabs Manager is running at http://localhost:${PORT}`);
});
