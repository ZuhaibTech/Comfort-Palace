const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 3000;
const BACKEND_URL = 'http://localhost:3001';

// Proxy /api requests to backend
app.use('/api', createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    return '/api' + path; // Re-add /api since express strips it
  }
}));

// Proxy /uploads requests to backend
app.use('/uploads', createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    return '/uploads' + path; // Re-add /uploads since express strips it
  }
}));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React Router fallback (serve index.html for all other routes)
app.use((req, res) => {
  const fs = require('fs');
  const indexHtmlPath = path.join(__dirname, 'dist', 'index.html');
  try {
    const content = fs.readFileSync(indexHtmlPath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.send(content);
  } catch (err) {
    res.status(500).send('Error loading index.html: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Local Proxy Server running at http://localhost:${PORT}`);
  console.log(`Frontend is served from /dist`);
  console.log(`API and Uploads proxying to ${BACKEND_URL}`);
});
