import CanvasController from './canvas';
import FormController from './form';
import controlsView from './controls.ejs';
import canvasView from './canvas.ejs';
import strings from './strings.json';
import './style.scss';

class Jeloltplakat2022 {
    constructor(controlsRoot, canvasRoot, ImageUpload, CanvasDownload) {
        controlsRoot.html(controlsView({strings}));
        canvasRoot.html(canvasView());

        this.canvasController = new CanvasController();
        this.formController = new FormController();

        this.formController.setCallbacks({
            textChange: texts => this.canvasController.setText(texts),
            saveClick: type => CanvasDownload.download(this.canvasController.getCanvas(type), this.formController.texts.name, type),
            userImageType: type => this.canvasController.setUserImageType(type),
            userImageSelected: ImageUpload.readImageFile,
            showCircle: isCircle => this.canvasController.setCircle(isCircle),
            cutCircle: isCutEnabled => this.canvasController.setCircleCut(isCutEnabled),
            circleHeight: circleHeight => this.canvasController.setCircleHeight(circleHeight)
        });
    }

    setUserImage(img, isPNG) {
        this.canvasController.setUserImage(img, isPNG);
    }
}

export default Jeloltplakat2022;
