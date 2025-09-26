import {imageLoader, clearCanvas, drawBackgroundColor, drawText} from '../../utils';
import config from './config.json';
import fonts from '../../fonts.json';

const backgroundSrcPrefix = './img/hatter_jelolt_';

class CanvasController {
    constructor() {
        this.HTMLcanvas = [];
        this.background = config.background;
        this.textValues = {};
        this.fonts = {};

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
        this.canvas.forEach(clearCanvas);

        if(config.userImage.show) {
            if(config.userImage.circle) {
                this.canvas.forEach(drawBackgroundColor);
                this.drawBackgroundImage(this.background.userImage.front);
                this.drawImage(config.userImage);
                this.drawBackgroundImage(this.background.userImage.front, config.userImage.circleCut ? config.circleHeight : undefined);
            }
            else {
                this.drawBackgroundImage(this.background.userImage.back);
                this.drawImage(config.userImage);
            }
        }
        else {
            this.drawBackgroundImage(this.background.default);
        }

        this.drawTextWithSelectedFonts(config, this.HTMLcanvas, this.textValues);
    }

    async loadBackground() {
        this.background = {
            default: {
                poster: await imageLoader(require(backgroundSrcPrefix + 'plakat_kutyafej.png')),
                fb_profile: await imageLoader(require(backgroundSrcPrefix + 'profile_kutyafej.png')),
                fb_cover: await imageLoader(require(backgroundSrcPrefix + 'cover_kutyafej.png'))
            },
            userImage: {
                back: {
                    poster: await imageLoader(require(backgroundSrcPrefix + 'plakat.png')),
                    fb_profile: await imageLoader(require(backgroundSrcPrefix + 'profile.png')),
                    fb_cover: await imageLoader(require(backgroundSrcPrefix + 'cover.png'))
                },
                front: {
                    poster: await imageLoader(require(backgroundSrcPrefix + 'plakat_front.png')),
                    fb_profile: await imageLoader(require(backgroundSrcPrefix + 'profile_front.png')),
                    fb_cover: await imageLoader(require(backgroundSrcPrefix + 'cover_front.png'))
                }
            }
        };
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

    setUserImageType(type) {
        if(type === 'default')
            config.userImage.show = false;
        else if(type === 'upload')
            config.userImage.show = true;
        this.repaint();
    }

    setUserImage(img, isPNG) {
        config.userImage.img = img;
        config.userImage.show = true;

        config.userImage.circleCut = isPNG;

        if(config.userImage.circleCut)
            $('#image-circle-cut-icon').show();
        else
            $('#image-circle-cut-icon').hide();

        $('.image-radio').removeClass('checked');
        $('#btn_image_upload').addClass('checked');
        $('#image-select-userimage').show();
        this.repaint();
    }

    setCircle(isCircle) {
        config.userImage.circle = isCircle;
        this.repaint();
    }

    setCircleCut(isCutEnabled) {
        config.userImage.circleCut = isCutEnabled;
        this.repaint();
    }

    setCircleHeight(circleHeight) {
        config.circleHeight = circleHeight >= 75 ? 100 : circleHeight;
        this.repaint();
    }

    drawBackgroundImage(imgData, cutTop) {
        if(!imgData)
            return;

        cutTop = 100 - cutTop;

        const imgArr = [imgData.poster, imgData.fb_profile, imgData.fb_cover];

        this.HTMLcanvas.forEach((canvasData, i) => {
            const canvas = canvasData.el;
            const img = imgArr[i];

            const canvasConfig = config.canvases.find(item => item.id === canvasData.id);
            const circle = canvasConfig.circlePosition;

            if(!canvas || !img)
                return;

            const ctx = canvas.getContext('2d');

            const circleCut = (cutTop ? ((img.height / 100) * (circle.top + ((circle.bottom - circle.top) / 100) * cutTop)) : 0);

            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.min(hRatio, vRatio);
            const centerShift_x = (canvas.width - img.width * ratio) / 2;
            const centerShift_y = ((canvas.height - img.height * ratio) / 2) + circleCut;

            ctx.drawImage(img, 0, circleCut, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        });
    }

    drawImage(imgData) {
        if(!imgData)
            return;

        const imgSizes = [imgData.poster, imgData.fb_profile, imgData.fb_cover];
        const img = imgData.img;

        this.HTMLcanvas.forEach((canvasData, i) => {
            const canvas = canvasData.el;
            const size = imgSizes[i];

            if(!canvas || !size || !img)
                return;

            const ctx = canvas.getContext('2d');
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            let x = canvasWidth * (size.x / 100);
            let y = canvasHeight * (size.y / 100);

            const originalWidth = canvasWidth * (size.width / 100);
            const originalHeight = canvasHeight * (size.height / 100);
            let width = originalWidth;
            let height = originalHeight;

            if ((img.width / img.height) > (width / height)) {
                width = canvasWidth * (size.width / 100);
                height = img.height * (width / img.width);
            }
            else {
                height = canvasHeight * (size.height / 100);
                width = img.width * (height / img.height);
            }

            if (!config.userImage.circle/* || !config.userImage.circleCut*/) {
                width *= 1.3;
                height *= 1.3;
                y += canvasHeight * 0.05;
            }
            else if (!config.userImage.circleCut) {
                width *= 0.8;
                height *= 0.8;
                y += canvasHeight * 0.05;
            }

            x += (originalWidth - width) / 2;
            y += (originalHeight - height) / 2;

            ctx.drawImage(img, 0, 0, img.width, img.height, x, y, width, height);
        });
    }

    drawTextWithSelectedFonts(config, canvases, textValues) {
        config.canvases.forEach(canvasConfig => canvasConfig.texts.forEach(textConfig => {
            const options = Object.assign(config.textDefaults.find(item => item.id === textConfig.id), textConfig);
            const value = textValues[textConfig.id] === undefined ? options.defaultValue : textValues[textConfig.id];
            const canvas = canvases.find(item => item.id === canvasConfig.id).el;

            // Use selected font if available, otherwise use default from config
            const selectedFontId = this.fonts[textConfig.id];
            if (selectedFontId) {
                const fontConfig = fonts.find(f => f.id === selectedFontId);
                if (fontConfig) {
                    options.font = fontConfig.family;
                }
            }

            drawText(value, canvas, options);
        }));
    }
}

export default CanvasController;
