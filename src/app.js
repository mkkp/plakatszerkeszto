import 'babel-polyfill';
import './style/main.scss';
import hu from './lang/hu.json';
import defaultView from './views/default.ejs';
import DragNDrop from './dragndrop';
import ImageUpload from './imageUpload';
import CanvasDownload from './canvasDownload';
import Jeloltplakat2018 from "./poster-types/jeloltplakat-2018";
import Jeloltplakat2022 from "./poster-types/jeloltplakat-2022";
import EsemenyBorito from "./poster-types/esemeny-borito";

const defaultType = 'jeloltplakat-2022';

$(function() {
    $('#content').html(defaultView({strings: hu}));

    $('#poster_type_select').change(changeType);

    DragNDrop.init(ImageUpload.readImageFile);

    changeType();
});

function changeType() {
    const type = $('#poster_type_select').val() || defaultType;
    const controlsRoot = $('.controls');
    const canvasRoot = $('.preview_cnt');
    let typeController;

    if (type === 'jeloltplakat-2018') {
        typeController = new Jeloltplakat2018(controlsRoot, canvasRoot, ImageUpload, CanvasDownload);
    }
    else if (type === 'jeloltplakat-2022') {
        typeController = new Jeloltplakat2022(controlsRoot, canvasRoot, ImageUpload, CanvasDownload);
    }
    else if (type === 'esemeny-borito') {
        typeController = new EsemenyBorito(controlsRoot, canvasRoot, ImageUpload, CanvasDownload);
    }

    ImageUpload.onUpload((img, isPNG) => typeController.setUserImage(img, isPNG));
}
