import {imageLoader, clearCanvas, drawOverlay, drawTextFromConfig} from '../../utils';
import config from './config.json';

const backgroundSrcPrefix = './bg/';

class CanvasController {
    constructor() {
        this.HTMLcanvas = [];
        this.background = null;
        this.textColor = 'black';
        this.textValues = {};
        this.options = {};

        config.canvases.forEach(canvas => {
            const canvasElement = document.getElementById('canvas_' + canvas.id);

            canvasElement.width = canvas.size.width;
            canvasElement.height = canvas.size.height;

            this.HTMLcanvas.push({
                id: canvas.id,
                el: canvasElement
            });
        });

        this.loadBackground();
        this.repaint();
        // Wait for the fonts to load
        setTimeout(() => this.repaint(), 1000);
    }

    get canvas() {
        return this.HTMLcanvas.map(canvas => canvas.el);
    }

    getCanvas(id) {
        return this.HTMLcanvas.find(item => item.id === id).el;
    }

    repaint() {
        const color = this.options.isCustomBg ? this.options.textColor : this.textColor;
        const overlayColor = this.options.textColor === 'black' ? 'white' : 'black';

        this.canvas.forEach(clearCanvas);
        this.drawBackgroundImage(this.background);

        if (this.options.overlayEnabled && this.options.isCustomBg)
            drawOverlay(this.HTMLcanvas[0].el, config.canvases[0].overlays[0], overlayColor);

        drawTextFromConfig(config, this.HTMLcanvas, this.textValues, color);
    }

    async loadBackground() {
        this.background = await imageLoader(require(backgroundSrcPrefix + '01.png'));
        this.repaint();
    }

    setText(texts) {
        for (const textField of config.textDefaults) {
            this.textValues[textField.id] = texts[textField.id] || '';
        }
        this.repaint();
    }

    setOptions(options) {
        this.options = options;
        this.repaint();
    }

    async setBg(img, textColor) {
        this.background = await imageLoader(img);
        this.textColor = textColor;
        this.repaint();
    }

    async setCustomBg(img) {
        this.background = img;
        this.textColor = 'black';
        this.repaint();
    }

    drawBackgroundImage(img) {
        if(!img)
            return;

        this.HTMLcanvas.forEach((canvasData, i) => {
            const canvas = canvasData.el;

            if(!canvas)
                return;

            const ctx = canvas.getContext('2d');

            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio);
            const centerShift_x = (canvas.width - img.width * ratio) / 2;
            const centerShift_y = ((canvas.height - img.height * ratio) / 2);

            ctx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        });
    }
}

export default CanvasController;
