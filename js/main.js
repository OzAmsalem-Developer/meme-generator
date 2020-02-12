'use strict';

var gCanvas;
var gCtx;

function onInit() {
    $('.generator-container').hide();
    _renderGallery();
    gCanvas = document.getElementById('my-canvas');
    gCanvas.width = $(window).width() / 2 - 20;
    gCanvas.height = $(window).width() / 2 - 20;
    gCtx = gCanvas.getContext('2d');
}

function onSelectImg(imgId) {
    $('.gallery-container').hide();
    $('.generator-container').show();
    setMemeProp('selectedImgId', imgId)
    _drawMeme();
}

function onTypeText(txt) {
    console.log(txt);
    setMemeProp('txt', txt, true)
    _drawMeme();
}

function onSetTxtColor(color) {
    setMemeProp('fillColor', color, true);
    _drawMeme();
}

function onSetStrokeColor(color) {
    setMemeProp('strokeColor', color, true);
    _drawMeme();
}

function onSetTxtAlign(align) {
    setMemeProp('align', align, true);
    _drawMeme();
}

function onSetTxtSize(op) {
    let currSize = getLineSize();
    let newSize = (op === '+')? ++currSize : --currSize;
    setMemeProp('size', newSize, true);
    _drawMeme();
}

// Private Functions

function _renderGallery() {
    let imgs = getImgs();
    let strHtmls = imgs.map(img => {
        return `<img onclick="onSelectImg(${img.id})" src="${img.url}" alt="${'Image' + img.id}"></img>`
    }).join('');
    $('.imgs-container').html(strHtmls);
}

function _drawMeme() {
    let meme = getMeme();
    let img = new Image();
    img.src = `img/gallery-squares/${meme.selectedImgId}.jpg`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        _drawTextLines(meme.lines);
    }
}

function _drawTextLines(lines) {
    lines.forEach((line,idx) => {
        let xStart = gCanvas.width / 2;
        let yStart = (idx === 0)? 60 : (idx === 1) ? gCanvas.height - 60 : gCanvas.height/2;
        xStart += (line.align === 'right')? 60 : (line.align === 'left') ? -60 : 0;

        gCtx.lineWidth = '3';
        gCtx.fillStyle = line.fillColor;
        gCtx.strokeStyle = line.strokeColor;
        gCtx.font = line.size + 'px Impact';
        gCtx.textAlign = line.align;
        gCtx.fillText(line.txt ,xStart,yStart);
        gCtx.strokeText(line.txt ,xStart,yStart);
    });
}

