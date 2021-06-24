let imageUpload = {};
let callback = function(){};

imageUpload.readImageFile = function(file) {
    let isPNG = false;
    // don't try to process non-images
    if (!file.type.match(/image.*/)) {
        return;
    }
    if (file.type.match(/image\/png/)) {
        isPNG = true;
    }

    // a seed img element for the FileReader
    const img = document.createElement("img");
    //img.classList.add("obj");
    img.file = file;

    const reader = new FileReader();
    reader.onload = (function(aImg) {
        return function(e) {
            aImg.onload = function() {
                callback(aImg, isPNG);
            }
            aImg.src = e.target.result;
        };
    })(img);
    reader.readAsDataURL(file);
}

imageUpload.onUpload = function(cb) {
    if(typeof cb === 'function')
        callback = cb;
}

export default imageUpload;
