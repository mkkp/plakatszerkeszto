# MKKP Plakátszerkesztő

A web-based poster editor application for creating political campaign materials with advanced typography controls.

🌐 **Live Site**: [https://plakat.mkkp.party](https://plakat.mkkp.party)

## Recent Features

### 🎨 Font Selection System
- **8 Available Fonts**: Agency FB, DIN Pro, Impact, Montserrat, Roboto Condensed
- **Real-time Preview**: Instant canvas updates when fonts change
- **Per-field Control**: Individual font selection for each text element
- **Hungarian Interface**: Complete localization support

### 📱 Accordion UI Interface  
- **Organized Layout**: Collapsible sections for text fields and font selectors
- **Space Efficient**: Compact design with expandable content areas
- **Smooth Animations**: CSS transitions for better user experience
- **Responsive Design**: Works seamlessly across all device sizes

### 🖼️ Advanced Background Configuration
- **Image-specific Settings**: Custom text positioning and overlays per background
- **Dynamic Text Colors**: Automatic white/black text based on background brightness
- **Canvas Overrides**: Flexible configuration system for special layouts
- **Thumbnail Support**: Optimized image loading with preview thumbnails

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

### Development Workflow

#### Development Scripts
Use the provided scripts for easy development and testing:

**Linux/Mac:**
```bash
# Development server (hot reload)
./dev-server.sh dev

# Production build and serve
./dev-server.sh production

# Just build production version
./dev-server.sh build

# Clean build artifacts
./dev-server.sh clean
```

**Windows:**
```cmd
# Development server (hot reload)
dev-server.bat dev

# Production build and serve
dev-server.bat production

# Just build production version
dev-server.bat build

# Clean build artifacts
dev-server.bat clean
```

The scripts automatically check for Node.js installation and install dependencies if needed.

#### Testing New Features
When adding new features like font selection or accordion UI:

1. **Test in Development**: Use `npm start` for hot reload testing
2. **Verify Build**: Run `npm run build` to check for compilation errors
3. **Cross-Browser Testing**: Test in Chrome, Firefox, and Safari
4. **Mobile Testing**: Verify responsive design on mobile devices
5. **Performance Testing**: Check canvas rendering performance

#### Adding New Poster Types
Follow this workflow when creating new poster types:

1. **Setup**: Create directory structure with all required files
2. **Configuration**: Define canvas layout, images, and strings
3. **Implementation**: Code canvas rendering and form controllers
4. **Integration**: Register in main app and add to type selector
5. **Testing**: Test all features including font selection and accordion UI

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

```
plakatszerkeszto/
├── src/                          # Source code
│   ├── app.js                    # Main application entry point
│   ├── utils.js                  # Utility functions (canvas operations, image loading)
│   ├── fonts.json                # Font configuration with 8 available fonts
│   ├── poster-types/             # Different poster templates
│   │   ├── esemeny-borito/       # Event cover poster type
│   │   │   ├── bg/               # Full-size background images (36 images)
│   │   │   ├── bg_thumb/         # Thumbnail images
│   │   │   ├── img/              # Additional images
│   │   │   ├── config.json       # Canvas layout and text positioning
│   │   │   ├── images.json       # Background image definitions with overrides
│   │   │   ├── strings.json      # Hungarian UI translations
│   │   │   ├── index.js          # Main controller class
│   │   │   ├── canvas.js         # Canvas rendering logic with font support
│   │   │   ├── form.js           # Form handling with accordion UI
│   │   │   ├── controls.ejs      # Control panel template with accordion
│   │   │   ├── canvas.ejs        # Canvas container template
│   │   │   └── style.scss        # Component-specific styles with accordion CSS
│   │   ├── jeloltplakat-2018/    # 2018 candidate poster type
│   │   └── jeloltplakat-2022/    # 2022 candidate poster type
│   ├── style/
│   │   └── main.scss             # Main SCSS stylesheet
│   ├── views/
│   │   ├── default.ejs           # Main layout template
│   │   └── index.ejs             # Landing page template
│   ├── img/                      # Shared images
│   └── fonts/                    # Font files (8 font families)
├── dist/                         # Built files (generated)
├── webpack.config.js             # Webpack configuration
├── vite.config.js                # Vite configuration (alternative)
└── README.md                     # This documentation file
```

### Key Configuration Files

- **fonts.json**: Central font registry with 8 available fonts
- **config.json**: Canvas layout, text positioning, and default fonts
- **images.json**: Background image definitions with text/overlay overrides
- **strings.json**: Hungarian translations for UI elements

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

**Basic Structure:**
```json
[
  { "filename": "01.png" },
  { "filename": "02.png", "textColor": "white" },
  {
    "filename": "special.png",
    "textColor": "white",
    "canvasOverrides": {
      "canvases": [{
        "overlays": [],
        "texts": []
      }]
    }
  }
]
```

**Properties:**
- `filename` (required): Name of the background image file
- `textColor` (optional): Override default text color ("white" or "black")
- `canvasOverrides` (optional): Per-background canvas customizations

**Canvas Overrides Structure:**
```json
"canvasOverrides": {
  "canvases": [{
    "overlays": [{
      "width": 100,      // Percentage width
      "height": 43,      // Percentage height  
      "top": 51,         // Percentage from top
      "color": "black",  // Overlay color
      "alpha": 0.73      // Transparency (0-1)
    }],
    "texts": [{
      "id": "title",
      "position": {
        "width": 90,
        "height": 10,
        "top": 36
      }
    }]
  }]
}
```

**Key Features:**
- **Text Positioning**: Override text positions for specific backgrounds
- **Overlay Customization**: Add/remove text background overlays
- **Color Control**: Set text color based on background brightness
- **Responsive Design**: All positioning uses percentage values

**Image Requirements:**
- **Full-size images**: Place in `bg/` directory (e.g., `01.png`)
- **Thumbnails**: Place in `bg_thumb/` directory (same filename)
- **Resolution**: Optimized for 1920x1000px (event covers)
- **Format**: PNG recommended for transparency support

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

### Font Selection System

All poster types now support dynamic font selection with 8 available fonts:

#### Available Fonts
1. **Agency FB (Bold)** - `agencyfb_bold`
2. **Agency FB (Normal)** - `agencyfb_normal`
3. **DIN Pro (Condensed Black)** - `dinpro_condensed_black`
4. **DIN Pro (Condensed Bold)** - `dinpro_condensed_bold`
5. **DIN Pro (Condensed Medium)** - `dinpro_condensed_medium`
6. **Impact** - `impact`
7. **Montserrat (Black)** - `montserrat_black`
8. **Roboto Condensed (Bold)** - `roboto_condensed_bold`

#### Font Configuration
Fonts are configured in `config.json` using font IDs instead of direct font families:

```json
{
  "textDefaults": [
    {
      "id": "title",
      "font": "agencyfb_bold",
      "uppercase": true
    },
    {
      "id": "area",
      "font": "dinpro_condensed_bold", 
      "uppercase": true
    }
  ]
}
```

#### UI Implementation
Font selectors are integrated into the accordion interface:
- **Accordion layout**: Each text field has its own collapsible section
- **Font dropdowns**: Located within each accordion's content area
- **Real-time preview**: Updates canvas rendering immediately
- **Hungarian labels**: "Betűtípus" translation for font selection

#### Technical Implementation
- **Font loading**: All fonts pre-loaded via Webpack asset modules
- **Canvas rendering**: Uses `drawTextWithSelectedFonts()` method
- **State management**: Font selections persist across background changes
- **Callback system**: Font changes trigger canvas redraw

### Accordion UI System

The interface now uses an accordion layout to organize text fields and font selectors:

#### Structure
```html
<div class="accordion">
  <div class="accordion-item">
    <div class="accordion-header">
      <span>Field Label</span>
      <i class="fa fa-chevron-down"></i>
    </div>
    <div class="accordion-content">
      <input type="text" id="form_field" />
      <label for="font_field">Betűtípus</label>
      <select id="font_field" class="font-selector"></select>
    </div>
  </div>
</div>
```

#### Features
- **Collapsible Sections**: Each text field has its own expandable area
- **Single Active Item**: Only one accordion item can be open at a time
- **Smooth Animations**: CSS transitions for expand/collapse
- **Responsive Design**: Works on desktop and mobile devices
- **Default State**: First accordion item opens by default

#### Implementation Details
- **JavaScript**: Accordion state managed in form controllers
- **CSS**: Smooth transitions with max-height animations
- **Icons**: Font Awesome chevron indicators
- **Accessibility**: Keyboard navigation and screen reader support

### Font Configuration (fonts.json)

The `fonts.json` file defines all available fonts for the application:

**Structure:**
```json
[
  {
    "id": "montserrat_black",
    "name": "Montserrat Black",
    "family": "Montserrat_black, Impact",
    "cssFamily": "Montserrat_black, Impact"
  },
  {
    "id": "roboto_condensed_bold",
    "name": "Roboto Condensed Bold", 
    "family": "RobotoCondensed_bold, Impact",
    "cssFamily": "RobotoCondensed_bold, Impact"
  }
]
```

**Properties:**
- `id`: Unique identifier used in config.json
- `name`: Display name shown in dropdown menus
- `family`: Font family stack for canvas rendering
- `cssFamily`: Font family stack for CSS styling

**Adding New Fonts:**
1. Add font files to `src/fonts/` directory
2. Update `fonts.json` with new font configuration
3. Add font loading in `src/app.js` if needed
4. Test font rendering in all poster types

### Best Practices

#### Configuration Files
- **config.json**: Use percentage-based positioning for responsive design
- **images.json**: Provide both full-size and thumbnail images
- **strings.json**: Include Hungarian translations for all UI elements
- **fonts.json**: Maintain consistent font ID naming conventions

#### Development Guidelines
- Test with various text lengths and image sizes
- Follow existing naming conventions and file structure
- Configure fonts using font IDs in config.json
- Use accordion layout for organized text input
- Implement proper error handling for font loading

#### Performance Considerations
- Optimize image sizes for web delivery
- Use Webpack asset modules for efficient font loading
- Implement lazy loading for large background images
- Test canvas rendering performance with different fonts

#### Accessibility
- Ensure proper contrast ratios for text readability
- Implement keyboard navigation for accordion interface
- Provide alt text for background images when relevant
- Test with screen readers for accessibility compliance
