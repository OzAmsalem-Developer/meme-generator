'use strict';

var gCanvas;
var gCtx;

function onInit() {
    $('.generator-container').hide();
    $('.add-line').hide();

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

function onSetMemeProp(prop, val, isLineProp) {
    setMemeProp(prop, val, isLineProp);
    _drawMeme();
}

function onSetTxtSize(op) {
    let currSize = getLineInfo('size');
    let newSize = (op === '+') ? ++currSize : --currSize;
    setMemeProp('size', newSize, true);
    _drawMeme();
}

function onAddLine() {
    $('.add-line').hide();
    let txt = $('.new-line-txt').val();
    addLine(txt);
    _drawMeme();
    onSwitchLine();
    $('.new-line-txt').val('');
}

// function onMoveLine(direction) {

// }

function onRemoveLine() {
    removaLine();
    _drawMeme();
    onSwitchLine();
}

function toggleAddLine() {
    $('.add-line').toggle();
}

function onSwitchLine() {
    switchLine();
    let txt = getLineInfo('txt');
    $('.meme-txt').val(txt);
    _drawTxtBorder(getLineInfo('area'))
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
    lines.forEach((line, idx) => {
        let xStart;
        let yStart;
        
        if (!line.x || !line.y) {
            // Line show first time? get this x,y:
            xStart = gCanvas.width / 2;
            yStart = (idx === 0) ? 60 : (idx === 1) ? gCanvas.height - 60 : gCanvas.height / 2;
            setLinePos(xStart, yStart, idx);
        } else {
            xStart = line.x;
            yStart = line.y;
        }
        

        gCtx.lineWidth = '3';
        gCtx.fillStyle = line.fillColor;
        gCtx.strokeStyle = line.strokeColor;
        gCtx.font = line.size + 'px ' + line.fontFamily;
        gCtx.textAlign = line.align;
        gCtx.fillText(line.txt, xStart, yStart);
        gCtx.strokeText(line.txt, xStart, yStart);

        setLineArea(line)
    });
}

function _drawTxtBorder(lineArea) {
    gCtx.beginPath()
    gCtx.rect(lineArea.xStart, lineArea.yStart, lineArea.width, lineArea.height)
    gCtx.strokeStyle = 'black'
    gCtx.stroke()
}