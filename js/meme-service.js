'use strict';

var gId = 0;
var gKeywords = { 'happy': 12, 'funny puk': 1 }
var gImgs = _createImgs();
var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'Type in your meme',
            size: 40,
            align: 'center',
            fillColor: 'white',
            strokeColor: 'black',
            fontFamily: 'Impact',
            x: null,
            y: null,
            area: {
                xStart: 266,
                yStart: 55,
                width: 399,
                height: 84
            }
        }
    ]
};

function getImgs() {
    return gImgs;
}

function getMeme() {
    return gMeme;
}

function getSelectedLineInfo(prop) {
    return gMeme.lines[gMeme.selectedLineIdx][prop];
}

function setMemeProp(prop, val, isInLines = false) {
    if (isInLines) {
        let lineIdx = gMeme.selectedLineIdx;
        gMeme.lines[lineIdx][prop] = val;
    } else {
        gMeme[prop] = val;
    }
}

function addLine(txt) {
    let newLine = {
        txt: txt,
        size: 40,
        align: 'center',
        fillColor: 'white',
        strokeColor: 'black',
        fontFamily: 'Impact',
        area: {
            xStart: null,
            yStart: null,
            width: null,
            height: null
        }
    }
    gMeme.lines.push(newLine);
}

function switchLine() {
    if (gMeme.selectedLineIdx >= gMeme.lines.length - 1) gMeme.selectedLineIdx = 0;
    else gMeme.selectedLineIdx++;
    return gMeme.selectedLineIdx;
}

function removaLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
}

function setLinePos(posX, posY, lineIdx) {
    gMeme.lines[lineIdx].x = posX;
    gMeme.lines[lineIdx].y = posY;
}

function setLineArea(line) {
    let elCalculator = document.querySelector('.txt-size-calculator');
    elCalculator.innerText = line.txt;
    elCalculator.style.fontSize = line.size + 'px';
    elCalculator.style.fontFamily = line.fontFamily;

    let height = (+elCalculator.clientHeight);
    let width = (+elCalculator.clientWidth);

    line.area.yStart =  line.y - height + 10 ; //Because the text goes from bottom to top
    line.area.xStart = line.x - 5;
    line.area.xStart += (line.align === 'end') ? -width
        : (line.align === 'center') ? (-width / 2) : 0;
    line.area.width = width + 10;
    line.area.height = height;
}

function getHoveredLineIdx(x, y) {
    let hoveredLineIdx = gMeme.lines.findIndex(line => (x >= line.area.xStart && x <= line.area.width + line.area.xStart
        && y >= line.area.yStart && y <= line.y + 10 ))
    return hoveredLineIdx;
}

// Private Functions

function _createImgs() {
    let allImgsKeywords = [['happy', 'funny'], ['cute'], ['cute'], ['tired', 'cute']];
    return allImgsKeywords.map(keywords => _createImg(keywords));
}

function _createImg(keywords) {
    gId++;
    return {
        id: gId,
        url: 'img/gallery-squares/' + gId + '.jpg',
        keywords: keywords.join()
    }
}