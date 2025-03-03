import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5173;

// For development: Serve the root directory to allow Vite to handle assets
app.use(express.static(__dirname));

// For production: Uncomment this to serve the built files
// app.use(express.static(path.join(__dirname, 'dist')));

// Serve index.html for all routes (SPA support)
app.get('*', (req, res) => {
  // For development: Serve the root index.html
  res.sendFile(path.join(__dirname, 'index.html'));
  
  // For production: Uncomment this to serve the built index.html
  // res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Frontend server running at http://localhost:${port}`);
  console.log(`Note: For development, it's recommended to use 'npm run dev' instead.`);
});
