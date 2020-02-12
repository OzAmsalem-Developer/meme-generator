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
            strokeColor: 'black'
        }
    ]
};

function getImgs() {
    return gImgs;
}

function getMeme() {
    return gMeme;
}

function getLineSize() {
    return gMeme.lines[gMeme.selectedLineIdx].size;
}

function setMemeProp(prop, val, isInLines = false) {
    if(isInLines) {
        let lineIdx = gMeme.selectedLineIdx;
        gMeme.lines[lineIdx][prop] = val;
    } else {
        gMeme[prop] = val;
    }
}

function setMemeImg(imgId) {
    gMeme.selectedImgId = imgId;
}

// Private Funcs

function _createImgs() {
    let allImgsKeywords = [['happy', 'funny'], ['cute'] , ['cute'], ['tired', 'cute']];
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