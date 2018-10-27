/* global require */
const utils = require('./utils.js');
const fs = require('fs');

// let urls = fs.readFileSync('data/urlList2010.txt', 'utf8').split('\n');
let parsedSongs = JSON.parse(fs.readFileSync('data/parsedSongs.json', 'utf8'));
let skipSongs = new Set(parsedSongs.map(x => x.name));

// let songs2010 = utils.parseUrlList('data/urlList2010.txt', skipSongs, {'decade': '2010'});
// Promise.all(songs2010).then(results => {
//   parsedSongs.push(...results.filter(x => x !== null));
//   fs.writeFileSync('data/parsedSongs.json', JSON.stringify(parsedSongs), 'utf8');
// });

let songsRock = utils.parseUrlList('data/urlListRock.txt', skipSongs, {'genre': 'rock'});
Promise.all(songsRock).then(results => {
  parsedSongs.push(...results.filter(x => x !== null));
  fs.writeFileSync('data/parsedSongs.json', JSON.stringify(parsedSongs), 'utf8');
});