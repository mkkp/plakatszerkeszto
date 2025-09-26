# AGENTS.md - Plakátszerkesztő

## Build Commands
- `npm start` - Start development server with webpack-dev-server
- `npm run build` - Build for production (NODE_ENV=production webpack)
- `npm run deploy` - Deploy to gh-pages (gh-pages -d dist)
- `npm test` - No tests configured (echo "Error: no test specified")

## Development Setup
- Uses both Webpack (webpack.config.js) and Vite (vite.config.js) configurations
- Entry point: `src/app.js`
- Source directory: `src/`
- Build output: `dist/`

## Code Style Guidelines
- **Imports**: Use ES6 import/export syntax
- **File Structure**: Organize by poster types in `src/poster-types/`
- **Naming**: Hungarian notation for variables, camelCase for functions
- **Dependencies**: jQuery ($), Lodash (_) globally available via ProvidePlugin
- **Templates**: EJS templates with `.ejs` extension
- **Styling**: SCSS with main entry at `src/style/main.scss`
- **Assets**: Images in `src/img/`, fonts in `src/fonts/`
- **Error Handling**: Promise-based async operations

## Framework Conventions
- jQuery for DOM manipulation
- Canvas API for poster rendering
- Modular class-based architecture for poster types
- JSON configuration files for poster data
- Hungarian language strings in `src/lang/hu.json`

## Key Files
- `src/app.js` - Main application entry point
- `src/utils.js` - Utility functions (image loading, canvas operations)
- Poster type controllers in `src/poster-types/*/index.js`