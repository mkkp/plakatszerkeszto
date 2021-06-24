import 'babel-polyfill';
import './style/main.scss';
import config from './config.json';
import hu from './lang/hu.json';
import defaultView from './views/default.ejs';
import CanvasController from './canvas';
import FormController from './form';
import DragNDrop from './dragndrop';
import ImageUpload from './imageUpload';
import CanvasDownload from './canvasDownload';

$(function() {
    $('#content').html(defaultView({strings: hu}));

    ImageUpload.onUpload(CanvasController.setUserImage);
    CanvasController.init(config);
    FormController.init(config);
    DragNDrop.init(ImageUpload.readImageFile);

    FormController.setCallbacks({
        textChange: CanvasController.setText,
        saveClick: function(type) {
            switch(type) {
                case 'poster':
                    CanvasDownload.download(CanvasController.getCanvases().poster, FormController.getTexts().name, 'plakat');
                    break;
                case 'fb_profile':
                    CanvasDownload.download(CanvasController.getCanvases().fb_profile, FormController.getTexts().name, 'profilkep');
                    break;
                case 'fb_cover':
                    CanvasDownload.download(CanvasController.getCanvases().fb_cover, FormController.getTexts().name, 'boritokep');
                    break;
            }
        },
        userImageType: CanvasController.setUserImageType,
        userImageSelected: ImageUpload.readImageFile,
        showCircle: CanvasController.setCircle,
        cutCircle: CanvasController.setCircleCut,
        circleHeight: CanvasController.setCircleHeight
    });
});
