# MKKP Plakátszerkesztő

A web-based poster editor application for creating political campaign materials.

🌐 **Live Site**: [https://plakat.mkkp.party](https://plakat.mkkp.party)

## Development Setup

### Prerequisites
- Node.js 20+ (LTS recommended)
- npm (comes with Node.js)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/mkkp/plakatszerkeszto.git
   cd plakatszerkeszto
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the development server:
```bash
npm start
```
This runs webpack-dev-server and opens the application at `http://localhost:8080`

### Building for Production
Build the project for production:
```bash
npm run build
```
This creates optimized files in the `dist/` directory with NODE_ENV=production.

### Local Deployment
Deploy to GitHub Pages locally:
```bash
npm run deploy
```

## GitHub Actions Deployment

The project uses GitHub Actions for automated deployment to GitHub Pages.

### Workflow
- **File**: `.github/workflows/deploy.yml`
- **Trigger**: Manual (workflow_dispatch) - run from GitHub Actions tab
- **Environment**: Ubuntu latest with Node.js 20

### Deployment Process
1. **Checkout**: Repository is checked out
2. **Node Setup**: Node.js 20 is configured with npm caching
3. **Dependencies**: `npm ci` installs dependencies
4. **Build**: `npm run build` creates production build
5. **Deploy**: Built files are deployed to gh-pages branch

### Manual Deployment
1. Go to GitHub repository → Actions
2. Select "Build and Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select branch and run

### Automatic Deployment (Optional)
To enable automatic deployment on push to main branch, uncomment the trigger in `.github/workflows/deploy.yml`:
```yaml
on:
  push:
    branches: ["main"]
  workflow_dispatch:
```

## Project Structure

- `src/` - Source code
  - `app.js` - Main application entry point
  - `poster-types/` - Different poster templates
  - `utils.js` - Utility functions
  - `style/` - SCSS stylesheets
  - `views/` - EJS templates
  - `img/`, `fonts/` - Assets
- `dist/` - Built files (generated)
- `webpack.config.js` - Webpack configuration
- `vite.config.js` - Vite configuration (alternative)

## Technologies Used

- **Frontend**: jQuery, Canvas API, EJS templates
- **Build Tools**: Webpack, Babel, SCSS
- **Deployment**: GitHub Pages, GitHub Actions
- **Styling**: SCSS with responsive design

## Poster Type Configuration

### Esemeny-Borito (Event Cover) Configuration

The `esemeny-borito` poster type is configured through several JSON files:

#### config.json
Defines canvas layout and text positioning:
- `canvases`: Array of canvas configurations
  - `id`: Unique identifier for the canvas
  - `size`: Canvas dimensions in pixels
  - `texts`: Text field definitions with positioning (percentage-based)
  - `overlays`: Optional overlay elements for text backgrounds
- `textDefaults`: Default text values and styling
  - `id`: Matches text field IDs
  - `defaultValue`: Initial text content
  - `font`: Font family stack
  - `uppercase`: Whether to force uppercase

#### images.json
Defines available background images and their specific settings:
- Array of background objects with `filename`
- Optional `textColor`: Override default text color ("white" or "black")
- Optional `canvasOverrides`: Per-background canvas customizations
  - Can override `texts` positions and `overlays` properties

#### strings.json
UI text translations (Hungarian):
- `fields`: Form field labels
- UI element labels and instructions

### Adding New Poster Types

To create a new poster type:

1. **Create Directory Structure**:
   ```
   src/poster-types/new-poster-type/
   ├── bg/           # Full-size background images
   ├── bg_thumb/     # Thumbnail images
   ├── img/          # Additional images
   ├── config.json   # Canvas and text configuration
   ├── images.json   # Background image definitions
   ├── strings.json  # UI text translations
   ├── index.js      # Main controller class
   ├── canvas.js     # Canvas rendering logic
   ├── form.js       # Form handling
   ├── controls.ejs  # Control panel template
   ├── canvas.ejs    # Canvas container template
   └── style.scss    # Component-specific styles
   ```

2. **Implement Controller Class** (index.js):
   ```javascript
   import CanvasController from './canvas';
   import FormController from './form';
   import controlsView from './controls.ejs';
   import canvasView from './canvas.ejs';
   import strings from './strings.json';
   import './style.scss';
   import backgroundData from './images.json';

   class NewPosterType {
       constructor(controlsRoot, canvasRoot, ImageUpload, CanvasDownload) {
           // Initialize backgrounds, controllers, and set up callbacks
       }
       
       setUserImage(img, isPNG) {
           // Handle custom background image upload
       }
   }
   
   export default NewPosterType;
   ```

3. **Register in Main App** (src/app.js):
   ```javascript
   import NewPosterType from "./poster-types/new-poster-type";
   
   // Add to changeType() function
   else if (type === 'new-poster-type') {
       typeController = new NewPosterType(controlsRoot, canvasRoot, ImageUpload, CanvasDownload);
   }
   ```

4. **Add to Poster Type Selector** (src/views/default.ejs):
   ```html
   <select id="poster_type_select">
       <option value="jeloltplakat-2022">Jelöltplakát 2022</option>
       <option value="new-poster-type">New Poster Type</option>
   </select>
   ```

### Configuration Examples

#### Canvas Configuration
```json
{
  "canvases": [{
    "id": "event_cover",
    "size": { "width": 1920, "height": 1000 },
    "texts": [{
      "id": "title",
      "position": { "width": 90, "height": 10, "top": 56 }
    }]
  }]
}
```

#### Background Overrides
```json
{
  "filename": "special.png",
  "textColor": "white",
  "canvasOverrides": {
    "canvases": [{
      "overlays": [{
        "width": 100, "height": 43, "top": 51,
        "color": "black", "alpha": 0.73
      }]
    }]
  }
}
```

### Best Practices

- Use percentage-based positioning for responsive design
- Provide both full-size and thumbnail images
- Include Hungarian translations in strings.json
- Test with various text lengths and image sizes
- Follow existing naming conventions and file structure
