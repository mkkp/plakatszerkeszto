import moment from 'moment';

let canvasDownload = {};

canvasDownload.download = function(canvas, name, type) {
    const a = document.getElementById('da');
    a.setAttribute('href', canvas.toDataURL('image/jpeg').replace(/^data:image\/[^;]/, 'data:application/octet-stream'));
    a.setAttribute('download', name.replace(/\s/g, '').substring(0, 15) + '_' + type + '_' + moment().format('YYYYMMDD_HHmm') + '.jpg');
    a.setAttribute('type', 'image/jpeg');
    a.click();
}

export default canvasDownload;
