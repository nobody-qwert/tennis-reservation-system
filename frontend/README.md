# Tennis Court Reservation System - Frontend

This is the frontend for the Tennis Court Reservation System, built with React and Vite.

## Development

To start the development server:

```bash
npm run dev
```

This will start the Vite development server, which will serve the React application correctly.

## Server Configuration

The project includes two server options:

1. **Vite Development Server** (recommended for development)
   - Started with `npm run dev`
   - Provides hot module replacement and other development features
   - Correctly renders all React components including TestNavbar

2. **Express Server** (server.js)
   - Can be started with `node server.js`
   - Useful for production-like testing
   - Note: When using this server, make sure it's configured to serve the correct files

## Issue Resolution

Previously, the application was configured to use the Express server (server.js) for development, which was serving the static HTML file from the public directory instead of the Vite React application. This caused components like TestNavbar to not appear in the rendered HTML.

The solution was to use Vite's development server directly by changing the "dev" script in package.json from `"node server.js"` to `"vite"`.
