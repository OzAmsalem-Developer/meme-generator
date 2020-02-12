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

function getLineInfo(prop) {
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
            xEnd: null,
            yEnd: null
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
    let xStart = line.x - 5;
    let yStart = line.y - 5;

    let elCalculator = document.querySelector('.txt-size-calculator');
    elCalculator.innerText = line.txt;
    elCalculator.style.fontSize = line.size + 'px';
    elCalculator.style.fontFamily = line.fontFamily;
    let height = (+elCalculator.clientHeight);
    let width = (+elCalculator.clientWidth);


    line.area.xStart = xStart;
    line.area.xStart += (line.align === 'end')?  -width
    : (line.align === 'center')? (-width / 2) : 0;
    line.area.yStart = yStart;
    line.area.width = width;
    line.area.height = height;

    // console.log( 'x',xStart, xEnd);
    // console.log( 'y',yStart, yEnd);
    
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