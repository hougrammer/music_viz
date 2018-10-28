/* global require */
const utils = require('./utils.js');
const fs = require('fs');

let parsedSongs = JSON.parse(fs.readFileSync('data/parsedSongs.json', 'utf8'));

utils.parseUrlList('data/urlList2010.txt', parsedSongs, {'decade': '2010'})
  .then(parsedSongs => utils.parseUrlList('data/urlList2000.txt', parsedSongs, {'decade': '2000'}))
  .then(parsedSongs => utils.parseUrlList('data/urlListRock.txt', parsedSongs, {'genre': 'rock'}))
  .then(parsedSongs => { fs.writeFileSync('data/parsedSongs.json', JSON.stringify(parsedSongs), 'utf8'); });
