export function imageLoader(src) {
    return new Promise(resolve => {
        const img = new Image();
        img.addEventListener('load', () => resolve(img), false);
        img.src = src;
    });
}

export function clearCanvas(canvas) {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

export function drawBackgroundColor(canvas) {
    if(!canvas) return;

    const ctx = canvas.getContext("2d")
    const originalColor = ctx.fillStyle
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = originalColor;
}

export function drawOverlay(canvas, overlay, color) {
    if(!canvas || !overlay) return;

    const ctx = canvas.getContext("2d");
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    //const originalColor = ctx.fillStyle;

    const height = canvasHeight * (overlay.height / 100);
    const width = canvasWidth * (overlay.width / 100);
    const x = (canvasWidth - width) / 2;
    const y = canvasHeight * (overlay.top / 100);

    ctx.save();
    ctx.globalAlpha = 0.73;
    ctx.fillStyle = color || "white";
    ctx.fillRect(x, y, width, height);
    ctx.restore();
}

export function drawText(textValue, canvas, options) {
    if (!textValue || !canvas || !options) return;

    const text = options.uppercase ? textValue.toUpperCase() : textValue;
    const font = options.font;

    const lines = text.split('\n');
    const lineCount = lines[lines.length - 1] ? lines.length : lines.length - 1;

    const width = options.position.width;
    const height = options.position.height;
    const top = options.position.top;
    const centerX = options.position.centerX;

    const ctx = canvas.getContext('2d');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const maxWidth = canvasWidth / 100 * width;
    const maxHeight = canvasHeight / 100 * height;

    let fontSize = maxHeight / lineCount;
    let longestLine = lines[0];
    let textWidth;

    ctx.fillStyle = options.color || "black";
    ctx.font = fontSize + "pt " + font;

    for (let j = 0; j < lineCount; j++) {
        if (ctx.measureText(lines[j]).width > ctx.measureText(longestLine).width)
            longestLine = lines[j];
    }

    do {
        ctx.font = --fontSize + "pt " + font;
        textWidth = ctx.measureText(longestLine).width;
    } while (textWidth > maxWidth);

    let lineHeight = fontSize;
    if (lineCount > 1) {
        lineHeight = fontSize * 1.5;
    }

    const y = (canvasHeight * (top / 100)) + ((maxHeight - (lineHeight * lineCount)) / 2) + lineHeight;
    lines.forEach((line, index) => {
        const x = centerX
          ? ((canvasWidth / 100 * centerX) - ctx.measureText(line).width / 2)
          : ((canvasWidth - ctx.measureText(line).width) / 2);
        ctx.fillText(line, x, y + (index * lineHeight));
    });
}

export function drawTextFromConfig(config, canvases, textValues, color) {
    config.canvases.forEach(canvasConfig => canvasConfig.texts.forEach(textConfig => {
        const options = Object.assign(config.textDefaults.find(item => item.id === textConfig.id), textConfig);
        const value = textValues[textConfig.id] === undefined ? options.defaultValue : textValues[textConfig.id];
        const canvas = canvases.find(item => item.id === canvasConfig.id).el;

        options.color = color;

        drawText(value, canvas, options);
    }));
}
