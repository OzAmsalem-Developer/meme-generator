'use strict';

const MEMES_KEY = 'savedMemes';
const WORDS_KEY = 'searchWords';
var gSavedMemes = getFromStorage(MEMES_KEY) || [];
var gId = 0;
var gImgs = _createImgs();
var gMeme = _setInitialMeme();
var gKeywords = getFromStorage(WORDS_KEY) || _setInitialKeywords();

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
    if (prop !== 'dataUrl') gMeme.isSaved = false;
    if (prop === 'id') gMeme = _setInitialMeme();
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
    gMeme.isSaved = false;
}

function switchLine() {
    if (gMeme.selectedLineIdx >= gMeme.lines.length - 1) gMeme.selectedLineIdx = 0;
    else gMeme.selectedLineIdx++;
    return gMeme.selectedLineIdx;
}

function removaLine() {
    gMeme.isSaved = false;
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
}

function setLinePos(posX, posY, lineIdx) {
    gMeme.isSaved = false;
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

    line.area.yStart = line.y - height + 10; //Because the text goes from bottom to top
    line.area.xStart = line.x - 5;
    line.area.xStart += (line.align === 'end') ? -width
        : (line.align === 'center') ? (-width / 2) : 0;
    line.area.width = width + 10;
    line.area.height = height;
}

function getHoveredLineIdx(x, y) {
    let hoveredLineIdx = gMeme.lines.findIndex(line => (x >= line.area.xStart && x <= line.area.width + line.area.xStart
        && y >= line.area.yStart && y <= line.y + 10))
    return hoveredLineIdx;
}

function getSavedMemes() {
    return gSavedMemes;
}

function saveMeme() {
    let memeIdx = gSavedMemes.findIndex(meme => meme.id === gMeme.id);
    if (memeIdx >= 0) gSavedMemes[memeIdx] = gMeme;
    else gSavedMemes.push(gMeme);
    saveToStorage(MEMES_KEY, gSavedMemes);
    setTimeout(() => { gMeme.isSaved = true; }, 50);
}

function setMeme(memeId) {
    gMeme = gSavedMemes.find(meme => meme.id === memeId);
}

function updateKeyword(keyword) {
    if (!gKeywords[keyword]) return gImgs;
    gKeywords[keyword]++;
    saveToStorage(WORDS_KEY, gKeywords);
    return _getImgsByKeyword(keyword);
}

function getKeysForDisplay() {
    let keywords = [];
    let keysMapCopy = { ...gKeywords, newProp: 0 };
    while (keywords.length < 5) {
        let maxKeyVal = Math.max(...Object.values(keysMapCopy));
        let maxKey = Object.keys(keysMapCopy).find(key => keysMapCopy[key] === maxKeyVal);
        keysMapCopy[maxKey] = 0;
        keywords.push({key: maxKey, searches: maxKeyVal});
    }
    shuffle(keywords);
    return keywords;
}

// Private Functions

function _createImgs() {
    let allImgsKeywords = [['happy', 'funny'], ['cute'], ['cute'], ['tired', 'cute'],
    ['funny'], ['amazing'], ['wired'], ['magic'], ['kids'], ['funny'], ['gays'],
    ['point'], ['cheer'], ['shock'], ['fantastic'], ['unbelivable'], ['putin', 'thuff'], ['anima']];
    return allImgsKeywords.map(keywords => _createImg(keywords));
}
    
function _createImg(keywords) {
    gId++;
    return {
        id: gId,
        url: 'img/gallery-squares/' + gId + '.jpg',
        keywords: keywords
    }
}

function _setInitialMeme() {
    return {
        id: null,
        selectedImgId: 1,
        selectedLineIdx: 0,
        isSaved: false,
        dataUrl: null,
        lines: [
            {
                txt: 'Type your text',
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
    }
}

function _setInitialKeywords() {
    let initialKeywordsMap = gImgs.reduce((acc, img) => {
        img.keywords.forEach(keyword => {
            if (acc[keyword]) return acc;
            acc[keyword] = 1;
            if (Math.random() < 0.4) acc[keyword] = getRandomInt(1, 20);
        });
        return acc;
    }, {});
    saveToStorage(WORDS_KEY, initialKeywordsMap);
    return initialKeywordsMap;
}

function _getImgsByKeyword(keyword) {
    return gImgs.filter(img => img.keywords.includes(keyword));
}

