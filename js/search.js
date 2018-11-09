/* global require */
const ugs = require('./ultimate-guitar-scraper/lib/index.js');

ugs.search({
  query: 'Wish You Were Here Pink Floyd',
  page: 1,
  type: 'Chords'
}, (error, tabs) => {
  if (error) {
    console.log(error);
  } else {
    tabs.sort((a,b) => b.rating - a.rating);
    console.log(tabs);
  }
});