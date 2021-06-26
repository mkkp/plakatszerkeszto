import CanvasController from './canvas';
import FormController from "./form";
import controlsView from './controls.ejs';
import canvasView from './canvas.ejs';
import strings from './strings.json';
import './style.scss';

class EsemenyBorito {
    constructor(controlsRoot, canvasRoot, ImageUpload, CanvasDownload) {
        this.backgrounds = [
            { thumb: require('./bg_thumb/01.png'), src: require('./bg/01.png') },
            { thumb: require('./bg_thumb/02.png'), src: require('./bg/02.png') },
            { thumb: require('./bg_thumb/03.png'), src: require('./bg/03.png') },
            { thumb: require('./bg_thumb/04.png'), src: require('./bg/04.png') },
            { thumb: require('./bg_thumb/05.png'), src: require('./bg/05.png') },
            { thumb: require('./bg_thumb/06.png'), src: require('./bg/06.png'), textColor: 'white' },
            { thumb: require('./bg_thumb/07.png'), src: require('./bg/07.png'), textColor: 'white' },
        ];

        controlsRoot.html(controlsView({strings, backgrounds: this.backgrounds}));
        canvasRoot.html(canvasView());

        this.canvasController = new CanvasController();
        this.formController = new FormController();

        this.formController.setCallbacks({
            textChange: texts => this.canvasController.setText(texts),
            bgSelected: index => this.canvasController.setBg(this.backgrounds[index].src, this.backgrounds[index].textColor),
            saveClick: type => CanvasDownload.download(this.canvasController.getCanvas(type), this.formController.texts.title),
            //userImageType: type => this.canvasController.setUserImageType(type),
            userImageSelected: ImageUpload.readImageFile,
        });
    }

    setUserImage(img, isPNG) {
        //this.canvasController.setUserImage(img, isPNG);
    }
}

export default EsemenyBorito;
