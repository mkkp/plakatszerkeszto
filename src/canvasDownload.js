import moment from 'moment';

let canvasDownload = {};

canvasDownload.download = function(canvas, name, type) {
    let filename = name.replace(/\s/g, '').substring(0, 15);
    if (type) filename = filename + '_' + type;
    filename = filename + '_' + moment().format('YYYYMMDD_HHmm') + '.png';

    const a = document.getElementById('da');
    a.setAttribute('href', canvas.toDataURL('image/png').replace(/^data:image\/[^;]/, 'data:application/octet-stream'));
    a.setAttribute('download', filename);
    a.setAttribute('type', 'image/png');
    a.click();
}

export default canvasDownload;
