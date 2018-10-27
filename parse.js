/* global require */
const utils = require('./utils.js');
const fs = require('fs');

let urls = fs.readFileSync('data/urlList2010.txt', 'utf8').split('\n');
let parsedSongs = JSON.parse(fs.readFileSync('data/parsedSongs.json', 'utf8'));
let skipSongs = new Set(parsedSongs.map(x => x.name));

let songs = utils.parseUrlList(urls, skipSongs, {'decade': '2010'});
Promise.all(songs).then(results => {
  parsedSongs.push(...results.filter(x => x !== null));
  fs.writeFileSync('data/parsedSongs.json', JSON.stringify(parsedSongs), 'utf8');
});

// ugs.search({
//   query: 'Wish You Were Here Pink Floyd',
//   page: 1,
//   type: 'Chords'
// }, (error, tabs) => {
//   if (error) {
//     console.log(error);
//   } else {
//     tabs.sort((a,b) => b.numberRates - a.numberrates);
//     console.log(tabs);
//   }
// });