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
        this.activeBgConfig = null; // To store the config of the selected background

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

    getEffectiveConfig() {
        // Start with a deep copy of the base config to avoid modifying it.
        const effectiveConfig = JSON.parse(JSON.stringify(config));

        const overrides = this.activeBgConfig?.canvasOverrides;
        if (!overrides) {
            return effectiveConfig;
        }

        // Merge overrides for canvases (positions, overlays, etc.)
        if (overrides.canvases) {
            overrides.canvases.forEach(canvasOverride => {
                const baseCanvas = effectiveConfig.canvases.find(c => c.id === canvasOverride.id);
                if (!baseCanvas) return;

                if (canvasOverride.overlays) {
                    baseCanvas.overlays = canvasOverride.overlays;
                }

                if (canvasOverride.texts) {
                    canvasOverride.texts.forEach(textOverride => {
                        const baseText = baseCanvas.texts.find(t => t.id === textOverride.id);
                        if (baseText && textOverride.position) {
                            Object.assign(baseText.position, textOverride.position);
                        }
                    });
                }
            });
        }
        
        if (overrides.textDefaults) {
            overrides.textDefaults.forEach(textDefaultOverride => {
                const baseTextDefault = effectiveConfig.textDefaults.find(
                    td => td.id === textDefaultOverride.id
                );
                if (baseTextDefault) {
                    // Merge all properties from the override into the base default object
                    Object.assign(baseTextDefault, textDefaultOverride);
                }
            });
        }

        return effectiveConfig;
    }

    repaint() {
        const currentConfig = this.getEffectiveConfig();

        const color = this.options.isCustomBg ? this.options.textColor : this.textColor;
        let overlayColor = this.options.textColor === 'black' ? 'white' : 'black';
        let overlayAlpha = 0.73;
        this.canvas.forEach(clearCanvas);
        this.drawBackgroundImage(this.background);
        const overlayOverride = this.activeBgConfig?.canvasOverrides?.canvases[0]?.overlays[0];

        if (overlayOverride && overlayOverride.color) {
            overlayColor = overlayOverride.color;
        }

        if (overlayOverride && overlayOverride.alpha) {
            overlayAlpha = overlayOverride.alpha;
        }

        if (this.options.overlayEnabled && this.options.isCustomBg || overlayOverride)
            // Use the config from the merged result
            //if (overlayOverride.color == )
            drawOverlay(this.HTMLcanvas[0].el, overlayOverride, overlayColor, overlayAlpha);

        // Pass the merged config to the drawing utility
        drawTextFromConfig(currentConfig, this.HTMLcanvas, this.textValues, color);
    }

    async loadBackground() {
        // Note: The initial background won't have overrides unless you define it
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
    
    async setBg(bgConfig) {
        this.background = await imageLoader(bgConfig.src);
        this.textColor = bgConfig.textColor || 'black'; // Fallback to black if not specified
        this.activeBgConfig = bgConfig; // Store the full config object
        this.repaint();
    }

    async setCustomBg(img) {
        this.background = img;
        this.textColor = 'black';
        this.activeBgConfig = null; // A custom BG has no overrides
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