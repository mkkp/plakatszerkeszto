import CanvasController from './canvas';
import FormController from "./form";
import controlsView from './controls.ejs';
import canvasView from './canvas.ejs';
import strings from './strings.json';
import './style.scss';
import backgroundData from './images.json';

// Create a context for each image directory.
// This tells Webpack to make all .png files in these folders available for dynamic import.
const srcContext = require.context('./bg', false, /\.png$/);
const thumbContext = require.context('./bg_thumb', false, /\.png$/);

class EsemenyBorito {
    constructor(controlsRoot, canvasRoot, ImageUpload, CanvasDownload) {
        this.backgrounds = backgroundData.map(bg => ({
            ...bg, // <-- Copies all original properties (like filename, textColor)
            thumb: thumbContext('./' + bg.filename),
            src: srcContext('./' + bg.filename)
        }));
        
        controlsRoot.html(controlsView({strings, backgrounds: this.backgrounds}));
        canvasRoot.html(canvasView());

        this.canvasController = new CanvasController();
        this.formController = new FormController();

        this.formController.setCallbacks({
            textChange: texts => this.canvasController.setText(texts),
            fontChange: fonts => this.canvasController.setFonts(fonts),
            optionsChange: options => this.canvasController.setOptions(options),
            bgSelected: index => this.canvasController.setBg(this.backgrounds[index]),
            customBgSelected: ImageUpload.readImageFile,
            saveClick: type => CanvasDownload.download(this.canvasController.getCanvas(type), this.formController.texts.title),
        });

        // Send initial font selection to canvas controller
        this.canvasController.setFonts(this.formController.fonts);
        
        // Send initial background selection to canvas controller
        this.canvasController.setBg(this.backgrounds[0]);
    }

    setUserImage(img, isPNG) {
        this.formController.customBgSelected();
        this.canvasController.setCustomBg(img);
    }
}

export default EsemenyBorito;
