'use strict';
// Add the | icon in the navbar
var gCanvas;
var gCtx;
var gMouse = {
    isDrag: false,
    draggingLine: null
}

function onInit() {
    gCanvas = document.getElementById('my-canvas');
    gCtx = gCanvas.getContext('2d');

    // Handle touch events
    gCanvas.addEventListener("touchstart", touchHandler, true);
    gCanvas.addEventListener("touchmove", touchHandler, true);
    gCanvas.addEventListener("touchend", touchHandler, true);
    gCanvas.addEventListener("touchcancel", touchHandler, true);

    resizeCanvas();

    $('.generator-container').hide();
    $('.saved-memes').hide();
    _renderGallery();
    _renderSavedMemes();
    _renderKeywords();
    // Event listeners
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
            _memeUnsaved();
            setLinePos(ev.offsetX, ev.offsetY, gMouse.draggingLine);
            _drawMeme();
        }
    });

    $('body').mouseup(() => gMouse.isDrag = false);
}

function onSelectImg(imgId) {
    _openGenerator();
    setMemeProp('id', makeId());
    onSetMemeProp('selectedImgId', imgId);
}

function onEditMeme(memeId) {
    setMeme(memeId);
    _openGenerator();
    _drawMeme();

}

function onSetMemeProp(prop, val, isLineProp = false) {
    setMemeProp(prop, val, isLineProp);
    _memeUnsaved();
    _drawMeme();
}

function onSetTxtSize(op) {
    let currSize = getSelectedLineInfo('size');
    let newSize = (op === '+') ? ++currSize : --currSize;
    onSetMemeProp('size', newSize, true);
}

function onAddLine() {
    addLine('Edit This Text');
    _drawMeme();
    onSwitchLine();
    $('.new-line-txt').val('');
    _memeUnsaved();
}

function onRemoveLine() {
    removaLine();
    _drawMeme();
    onSwitchLine();
    _memeUnsaved();
}

function onSwitchLine(ev) {
    // If the switch is from click on canvas
    if (ev) {
        let selectedLineIdx = getHoveredLineIdx(ev.offsetX, ev.offsetY);
        if (selectedLineIdx >= 0) setMemeProp('selectedLineIdx', selectedLineIdx);
        else {
            //Click on canvas but not on line? remove mark.
            _drawMeme(true);
            return;
        }
        // The click is from the 'switch' btn
    } else switchLine();

    let txt = getSelectedLineInfo('txt');
    if (txt === 'Type your text' || txt === 'Edit This Text') {
        $('.meme-txt').attr('placeholder', txt);
        $('.meme-txt').val('')
    } else $('.meme-txt').val(txt);
    _drawMeme();
}

function onSaveMeme() {
    _drawMeme(true);
    setTimeout(() => {
        $('.save-btn').addClass('disabled');
        $('.fb-share-btn').removeClass('disabled');
        $('.download-link').removeClass('disabled');
        setMemeProp('dataUrl', gCanvas.toDataURL("image/jpeg"));
        saveMeme();
        _renderSavedMemes();
    }, 50);
}

function onDownloadMeme(elLink, meme = null) {
    if (!getMeme().isSaved) return;
    const data = (meme) ? JSON.parse(meme).dataUrl : gCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-meme';
}

function onShareMeme() {
    if (!getMeme().isSaved) return;
    $('#share-btn').click();
}

function onSearch(keyword) {
    let imgsForDisplay = updateKeyword(keyword);
    
    if (imgsForDisplay) {
        _renderKeywords();
       _renderGallery(imgsForDisplay);
    }
}

function activeNav(elNavItem) {
    $('.nav-item').removeClass('active-nav');
    elNavItem.classList.add('active-nav');
    if ($('body').hasClass('menu-open')) closeNav();
}

function openGallery() {
    $('.generator-container').hide();
    $('.saved-memes').hide();
    $('.gallery-container').show();
}

function onDownloadSavedMeme(data, elBtn) {
    elBtn.href = data;
    elBtn.download = 'my-meme';
}

function clickTxtColor() {
    $('.txt-color').click();
}

function clickStrokeColor() {
    $('.stroke-color').click();
}

function resizeCanvas() {
    gCanvas.width = (window.innerWidth < 920) ? window.innerWidth - 100 : (window.innerWidth / 2) - 100;
    gCanvas.height = (gCanvas.width > 550) ? 500 : gCanvas.width;
    _drawMeme();
}

function openSavedMemes() {
    $('.generator-container').hide();
    $('.gallery-container').hide();
    $('.saved-memes').show();
}

function toggleMenu() {
    $('body').toggleClass('menu-open');
    $('.btn-container').toggleClass('change');
   
    setTimeout(() => {
        if ($('.btn-container').hasClass('change'))  $('.nav-items').css('top', 0);
       else  $('.nav-items').css('top', '-100%');
    }, 0);
}

function closeNav() {
    $('.nav-items').css('top', '-100%');
    $('body').removeClass('menu-open');
    $('.btn-container').removeClass('change');
}

function touchHandler(ev) {
    ev.preventDefault();
    let touch = ev.changedTouches[0];
    let simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent({
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup"
    }[ev.type], true, true, window, 1,
        touch.screenX, touch.screenY,
        touch.clientX, touch.clientY, false,
        false, false, false, 0, null);

    touch.target.dispatchEvent(simulatedEvent);
}

// Private Functions

function _renderGallery(imgs = getImgs()) {
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
        if (!isClean && getSelectedLineInfo('txt').length !== 0) 
        _drawTxtBorder(getSelectedLineInfo('area'));
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

function _renderSavedMemes() {
    let savedMemes = getSavedMemes();
    if (!savedMemes || savedMemes.length === 0) {
        $('.saved-memes-msg').text('There is no saved Memes yet..')
    } else {
        let strHtmls = savedMemes.map(meme => {
            return `
            <div class="card">
            <img class="meme-img" src="${meme.dataUrl}" alt="meme-image">
            <button class="edit-btn" onclick="onEditMeme('${meme.id}')">
            <img src="img/icons/edit.png" alt="edit-button"></button>
            <a class="download-meme" onclick="onDownloadSavedMeme('${meme.dataUrl}', this)">
            <img src="img/icons/download.png" alt="download-button"></a>
        </div>
            `
        }).join('');
        $('.memes-container').html(strHtmls);
    }
}

function _renderKeywords() {
    let keywords = getKeysForDisplay();
    let strHtmls = keywords.map((keyword) => {
        let fontSize = 20 + keyword.searches;
        if (fontSize > 50) fontSize = 50;
        if (+window.innerWidth <= 920) fontSize -= 10;
        
        return `<span onclick="onSearch('${keyword.key}')" style="font-size:${fontSize}px">${keyword.key}</span>`
    }).join('');
    $('.keywords-container').html(strHtmls);
}

function _memeUnsaved() {
    $('.fb-share-btn').addClass('disabled');
    $('.download-link').addClass('disabled');
    $('.save-btn').removeClass('disabled');
}

function _openGenerator() {
    $('.gallery-container').hide();
    $('.saved-memes').hide();
    $('.generator-container').show();
    $('.nav-item').removeClass('active-nav');
}