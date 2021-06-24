const backgroundSrcPrefix = './img/hatter_jelolt_';
let canvas = {};
let background = {};
let config;

canvas.init = function(conf) {
    config = conf;

    canvas.poster = document.getElementById('canvas_poster');
    canvas.fb_profile = document.getElementById('canvas_fb_profile');
    canvas.fb_cover = document.getElementById('canvas_fb_cover');

    loadBackground();

    canvas.resize(repaint);

    // Wait for the fonts to load
    setTimeout(function() {
        repaint();
    }, 1000);
}

canvas.resize = function(callback) {
    var backgroundSize = config.background.size;
    // set size for poster
    canvas.poster.width = backgroundSize.poster.width;
    canvas.poster.height = backgroundSize.poster.height;

    // set size for FB profile picture
    canvas.fb_profile.width = backgroundSize.fb_profile.width;
    canvas.fb_profile.height = backgroundSize.fb_profile.height;

    // set size for FB cover photo
    canvas.fb_cover.width = backgroundSize.fb_cover.width;
    canvas.fb_cover.height = backgroundSize.fb_cover.height;

    if(typeof callback === 'function')
        callback();
}

canvas.repaint = repaint;

canvas.setText = function(text) {
    config.name.val = text.name || config.name.val;
    config.area.val = text.area || config.area.val;
    config.promise.val = text.promise || config.promise.val;
    repaint();
}

canvas.setUserImageType = function(type) {
    if(type === 'default')
        config.userImage.show = false;
    else if(type === 'upload')
        config.userImage.show = true;
    repaint();
}

canvas.setCircle = function(isCircle) {
    config.userImage.circle = isCircle;
    repaint();
}

canvas.setCircleCut = function(isCutEnabled) {
    config.userImage.circleCut = isCutEnabled;
    repaint();
}

canvas.setCircleHeight = function(circleHeight) {
    config.circleHeight = circleHeight >= 75 ? 100 : circleHeight;
    repaint();
}

canvas.setUserImage = function(img, isPNG) {
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
    repaint();
}

canvas.getCanvases = function() {
    return canvas;
}

function imageLoader(src) {
    var img = new Image();
    img.addEventListener('load', repaint, false);
    img.src = src;
    return img;
}

function loadBackground() {
    background = {
        default: {
            poster: imageLoader(require(backgroundSrcPrefix + 'plakat_kutyafej.jpg')),
            fb_profile: imageLoader(require(backgroundSrcPrefix + 'profile_kutyafej.jpg')),
            fb_cover: imageLoader(require(backgroundSrcPrefix + 'cover_kutyafej.jpg'))
        },
        userImage: {
            back: {
                poster: imageLoader(require(backgroundSrcPrefix + 'plakat.png')),
                fb_profile: imageLoader(require(backgroundSrcPrefix + 'profile.jpg')),
                fb_cover: imageLoader(require(backgroundSrcPrefix + 'cover.jpg'))
            },
            front: {
                poster: imageLoader(require(backgroundSrcPrefix + 'plakat_front.png')),
                fb_profile: imageLoader(require(backgroundSrcPrefix + 'profile_front.png')),
                fb_cover: imageLoader(require(backgroundSrcPrefix + 'cover_front.png'))
            }
        }
    };
}

function drawBackgroundColor() {
    var canvasArr = [canvas.poster, canvas.fb_profile, canvas.fb_cover]

    for(var i = 0; i < canvasArr.length; i++) {
        var c = canvasArr[i]

        if(!c)
            continue;

        var ctx = c.getContext("2d")

        var oriColor = ctx.fillStyle
        ctx.fillStyle = 'white';

        ctx.fillRect(0, 0, c.width, c.height);

        ctx.fillStyle = oriColor;
    }
}

function drawBackgroundImage(imgData, cutTop) {
    if(!imgData)
        return;

    cutTop = 100 - cutTop;

    var canvasArr = [canvas.poster, canvas.fb_profile, canvas.fb_cover];
    var imgArr = [imgData.poster, imgData.fb_profile, imgData.fb_cover];
    var circleArr = [config.circlePosition.poster, config.circlePosition.fb_profile, config.circlePosition.fb_cover];

    for(var i = 0; i < canvasArr.length; i++) {
        var c = canvasArr[i];
        var img = imgArr[i];
        var circle = circleArr[i];

        if(!c || !img)
            continue;

        var ctx = c.getContext('2d');

        var circleCut = (cutTop ? ((img.height / 100) * (circle.top + ((circle.bottom - circle.top) / 100) * cutTop)) : 0);

        var hRatio = c.width / img.width;
        var vRatio = c.height / img.height;
        var ratio = Math.min(hRatio, vRatio);
        var centerShift_x = (c.width - img.width * ratio) / 2;
        var centerShift_y = ((c.height - img.height * ratio) / 2) + circleCut;

        ctx.drawImage(img, 0, circleCut, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
    }
}

function drawImage(imgData) {
    if(!imgData)
        return;

    var canvasArr = [canvas.poster, canvas.fb_profile, canvas.fb_cover];
    var imgSizes = [imgData.poster, imgData.fb_profile, imgData.fb_cover];
    var img = imgData.img;

    for(var i = 0; i < canvasArr.length; i++) {
        var c = canvasArr[i];
        var size = imgSizes[i];

        if(!c || !size || !img)
            continue;

        var ctx = c.getContext('2d');
        var canvasWidth = c.width;
        var canvasHeight = c.height;

        var x = canvasWidth * (size.x / 100);
        var y = canvasHeight * (size.y / 100);

        var oriWidth = canvasWidth * (size.width / 100);
        var oriHeight = canvasHeight * (size.height / 100);
        var width = oriWidth;
        var height = oriHeight;

        if((img.width / img.height) > (width / height)) {
            width = canvasWidth * (size.width / 100);
            height = img.height * (width / img.width);
        }
        else {
            height = canvasHeight * (size.height / 100);
            width = img.width * (height / img.height);
        }

        if(!config.userImage.circle/* || !config.userImage.circleCut*/) {
            width *= 0.9;
            height *= 0.9;
            y += canvasHeight * 0.05;
        }
        else if(!config.userImage.circleCut) {
            width *= 0.8;
            height *= 0.8;
            y += canvasHeight * 0.05;
        }

        x += (oriWidth - width) / 2;
        y += (oriHeight - height) / 2;

        ctx.drawImage(img, 0, 0, img.width, img.height, x, y, width, height);
    }
}

function drawText(textData) {
    var text = textData.val.toUpperCase();
    var font = textData.font;

    var lines = text.split('\n');
    var lineCount = lines[lines.length - 1] ? lines.length : lines.length - 1;

    var arr = [];

    if(textData.poster) {
        arr.push(textData.poster);
        arr[arr.length-1].canvas = canvas.poster;
    }

    if(textData.fb_profile) {
        arr.push(textData.fb_profile);
        arr[arr.length-1].canvas = canvas.fb_profile;
    }

    if(textData.fb_cover) {
        arr.push(textData.fb_cover);
        arr[arr.length-1].canvas = canvas.fb_cover;
    }

    for(var i = 0; i < arr.length; i++) {
        var width = arr[i].width;
        var height = arr[i].height;
        var top = arr[i].top;
        var c = arr[i].canvas;

        var ctx = c.getContext('2d');
        var canvasWidth = c.width;
        var canvasHeight = c.height;
        var textWidth;

        var maxWidth = canvasWidth / 100 * width;
        var maxHeight = canvasHeight / 100 * height;

        var fontSize = maxHeight / lineCount;
        var widerLine = lines[0];

        ctx.fillStyle = "black";
        ctx.font = fontSize + "pt " + font;

        for (var j = 0; j < lineCount; j++) {
            if (ctx.measureText(lines[j]).width > ctx.measureText(widerLine).width)
                widerLine = lines[j];
        }

        do {
            ctx.font = --fontSize + "pt " + font;
            textWidth = ctx.measureText(widerLine).width;
        } while (textWidth > maxWidth);

        var lineHeight = fontSize;
        if (lineCount > 1) {
            lineHeight = fontSize * 1.5;
        }

        var y = (canvasHeight * (top / 100)) + ((maxHeight - (lineHeight * lineCount)) / 2) + lineHeight;
        for (var j = 0; j < lineCount; j++) {
            var centerX = arr[i].centerX
                ? ((canvasWidth / 100 * arr[i].centerX) - ctx.measureText(lines[j]).width / 2)
                : ((canvasWidth - ctx.measureText(lines[j]).width) / 2);
            ctx.fillText(lines[j], centerX, y + (j * lineHeight));
        }
    }
}

function repaint() {
    canvas.poster.getContext('2d').clearRect(0, 0, canvas.poster.width, canvas.poster.height);
    canvas.fb_cover.getContext('2d').clearRect(0, 0, canvas.fb_cover.width, canvas.fb_cover.height);
    canvas.fb_profile.getContext('2d').clearRect(0, 0, canvas.fb_profile.width, canvas.fb_profile.height);

    if(config.userImage.show) {
        if(config.userImage.circle) {
            drawBackgroundColor();
            drawBackgroundImage(background.userImage.front);
            drawImage(config.userImage);
            drawBackgroundImage(background.userImage.front, config.userImage.circleCut ? config.circleHeight : undefined);
        }
        else {
            drawBackgroundImage(background.userImage.back);
            drawImage(config.userImage);
        }
    }
    else {
        drawBackgroundImage(background.default);
    }

    // Valasztokerulet
    drawText(config.area);

    // Nev
    drawText(config.name);

    // Igeret
    drawText(config.promise);
}

export default canvas;
