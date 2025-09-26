import {imageLoader, clearCanvas, drawOverlay, drawTextFromConfig} from '../../utils';
import config from './config.json';
import fonts from '../../fonts.json';

const backgroundSrcPrefix = './bg/';

class CanvasController {
    constructor() {
        this.HTMLcanvas = [];
        this.background = null;
        this.textColor = 'black';
        this.textValues = {};
        this.fonts = {};
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
                let baseCanvas;
                // First, try to find the canvas by its ID.
                if (canvasOverride.id) {
                    baseCanvas = effectiveConfig.canvases.find(c => c.id === canvasOverride.id);
                } 
                // If no ID is provided in the override AND there's only one canvas,
                // assume the override is for that single canvas.
                else if (effectiveConfig.canvases.length === 1) {
                    baseCanvas = effectiveConfig.canvases[0];
                }
                // If we couldn't find a canvas to apply the override to, skip it.
                if (!baseCanvas) return;

                // Now the rest of the logic works correctly.
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
                    Object.assign(baseTextDefault, textDefaultOverride);
                }
            });
        }

        return effectiveConfig;
    }

    repaint() {
        const currentConfig = this.getEffectiveConfig();

        const color = this.options.isCustomBg ? this.options.textColor : this.textColor;
        let overlayColor = color === 'white' ? 'black' : 'white';
        let overlayAlpha = 0.73;
        this.canvas.forEach(clearCanvas);
        this.drawBackgroundImage(this.background);
        
        // Get overlay configuration - prioritize custom background overrides
        const overlayOverride = this.activeBgConfig?.canvasOverrides?.canvases[0]?.overlays[0];
        const baseOverlay = currentConfig.canvases[0]?.overlays?.[0];
        const effectiveOverlay = overlayOverride || baseOverlay;

        if (effectiveOverlay && effectiveOverlay.color) {
            overlayColor = effectiveOverlay.color;
        }

        if (effectiveOverlay && effectiveOverlay.alpha) {
            overlayAlpha = effectiveOverlay.alpha;
        }

        // Draw overlay if enabled for custom backgrounds or if background has overlay defined
        const shouldDrawOverlay = (this.options.overlayEnabled && this.options.isCustomBg) || 
                                (effectiveOverlay && !this.options.isCustomBg);
        
        if (shouldDrawOverlay && effectiveOverlay) {
            drawOverlay(this.HTMLcanvas[0].el, effectiveOverlay, overlayColor, overlayAlpha);
        }

        // Pass the merged config to the drawing utility with selected fonts
        this.drawTextWithSelectedFonts(currentConfig, this.HTMLcanvas, this.textValues, color);
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

    setFonts(fonts) {
        this.fonts = fonts;
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

    drawTextWithSelectedFonts(config, canvases, textValues, color) {
        config.canvases.forEach(canvasConfig => canvasConfig.texts.forEach(textConfig => {
            const options = Object.assign(config.textDefaults.find(item => item.id === textConfig.id), textConfig);
            const value = textValues[textConfig.id] === undefined ? options.defaultValue : textValues[textConfig.id];
            const canvas = canvases.find(item => item.id === canvasConfig.id).el;

            options.color = color;
            
            // Use selected font if available, otherwise use default from config
            const selectedFontId = this.fonts[textConfig.id];
            if (selectedFontId) {
                const fontConfig = fonts.find(f => f.id === selectedFontId);
                if (fontConfig) {
                    options.font = fontConfig.family;
                }
            }

            // Use the drawText function directly
            const { drawText } = require('../../utils');
            drawText(value, canvas, options);
        }));
    }
}

export default CanvasController;