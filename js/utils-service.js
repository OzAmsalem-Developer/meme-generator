'use strict';

function makeId() {
    var length = 6;
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return txt;
}

function getFromStorage(key) {
    var val = localStorage.getItem(key);
    return JSON.parse(val)
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //max and min inclusive
  }

  function showTimer() {
    let hours = parseInt(gSecsPassed / 3600);
    let minutes = parseInt((gSecsPassed - hours * 3600) / 60);
    let seconds = gSecsPassed - (hours * 3600 + minutes * 60);

    if (hours < 10) hours = '0' + hours;
    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;

    document.querySelector('.timer span').innerText = hours + ":" + minutes + ":" + seconds;
}

function getClassName(location) {
    let cellClass = 'cell' + location.i + '-' + location.j;
    return cellClass;
}