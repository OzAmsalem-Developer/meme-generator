'use strict';

var gCanvas;
var gCtx;
var gMouse = {
    isDrag: false,
    draggingLine: null
}

function onInit() {
    $('.generator-container').hide();


    _renderGallery();
    gCanvas = document.getElementById('my-canvas');
    gCtx = gCanvas.getContext('2d');

    gCanvas.addEventListener("touchstart", touchHandler, true);
    gCanvas.addEventListener("touchmove", touchHandler, true);
    gCanvas.addEventListener("touchend", touchHandler, true);
    gCanvas.addEventListener("touchcancel", touchHandler, true);

    gCanvas.width = 500 ;
    gCanvas.height = 500 ;
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, false);

    $('#my-canvas').mousedown((ev) => {

        let hoveredLineIdx = getHoveredLineIdx(ev.offsetX, ev.offsetY);
        if (hoveredLineIdx >= 0) {
            gMouse.isDrag = true;
            gMouse.draggingLine = hoveredLineIdx;
            if (hoveredLineIdx !== getMeme().selectedLineIdx) {
                setMemeProp('selectedLineIdx', hoveredLineIdx);
                _drawMeme();
            }
        }
    });
    $('#my-canvas').mousemove((ev) => {

        let hoveredLineIdx = getHoveredLineIdx(ev.offsetX, ev.offsetY);
        if (hoveredLineIdx >= 0) $('#my-canvas').css('cursor', 'move');
        else $('#my-canvas').css('cursor', 'default');

        if (gMouse.isDrag) {
            setLinePos(ev.offsetX, ev.offsetY, gMouse.draggingLine);
            _drawMeme();    
        }
    });
    $('body').mouseup(() => gMouse.isDrag = false);
}

function onSelectImg(imgId) {
    $('.gallery-container').hide();
    $('.generator-container').show();
    $('.nav-item').removeClass('active-nav');
    setMemeProp('selectedImgId', imgId)
    _drawMeme();
}

function onSetMemeProp(prop, val, isLineProp) {
    setMemeProp(prop, val, isLineProp);
    _drawMeme();
}

function onSetTxtSize(op) {
    let currSize = getSelectedLineInfo('size');
    let newSize = (op === '+') ? ++currSize : --currSize;
    setMemeProp('size', newSize, true);
    _drawMeme();
}

function onAddLine() {
    addLine('Edit This Text');
    _drawMeme();
    onSwitchLine();
    $('.new-line-txt').val('');
}

function onSelectLine(ev) {
    ev.stopPropagation();
    let selectedLineIdx = getHoveredLineIdx(ev.offsetX, ev.offsetY);
    if (selectedLineIdx >= 0) {
        setMemeProp('selectedLineIdx', selectedLineIdx);
        let txt = getSelectedLineInfo('txt');
        $('.meme-txt').val(txt);
        _drawMeme();
    } else {
        _drawMeme(true)
    }
}

function onRemoveLine() {
    removaLine();
    _drawMeme();
    onSwitchLine();
}

function onSwitchLine() {
    switchLine();
    let txt = getSelectedLineInfo('txt');
    $('.meme-txt').val(txt);
    _drawMeme();
}

function onDownloadMeme(elLink) {
    const data = gCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-meme';
}

function activeNav(elNavItem) {
    $('.nav-item').removeClass('active-nav');
    elNavItem.classList.add('active-nav');
}

function clickTxtColor() {
    $('.txt-color').click();
}

function clickStrokeColor() {
    $('.stroke-color').click();
}

function resizeCanvas() {
    gCanvas.width = (window.innerWidth < 920)? window.innerWidth - 100 : (window.innerWidth / 2) - 100;
    gCanvas.height = gCanvas.width;
}

function touchHandler(event) {
    let touch = event.changedTouches[0];

    let simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent({
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup"
    }[event.type], true, true, window, 1,
        touch.screenX, touch.screenY,
        touch.clientX, touch.clientY, false,
        false, false, false, 0, null);

    touch.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

// Private Functions

function _renderGallery() {
    let imgs = getImgs();
    let strHtmls = imgs.map(img => {
        return `<img onclick="onSelectImg(${img.id})" src="${img.url}" alt="${'Image' + img.id}"></img>`
    }).join('');
    $('.imgs-container').html(strHtmls);
}

function _drawMeme(isClean = false) {
    let meme = getMeme();
    let img = new Image();
    img.src = `img/gallery-squares/${meme.selectedImgId}.jpg`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        _drawTextLines(meme.lines);
        if(!isClean) _drawTxtBorder(getSelectedLineInfo('area')); 
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
    gCtx.beginPath();
    gCtx.lineWidth = '1';
    gCtx.rect(lineArea.xStart, lineArea.yStart, lineArea.width, lineArea.height);
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
    gCtx.closePath();
}