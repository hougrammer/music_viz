/* global require */
const ugs = require('../ultimate-guitar-scraper/lib/index.js');
const fs = require('fs');

let f = fs.readFileSync('urlList.txt', 'utf8').split('\n');
console.log(f[0]);
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