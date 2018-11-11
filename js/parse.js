/**
 * Script used for parsing songs
 */

/* global require */
const utils = require('./utils.js');
const fs = require('fs');

let parsedSongs = JSON.parse(fs.readFileSync('data/parsedSongs.json', 'utf8'));

(new Promise(resolve => {resolve(parsedSongs);})) // dummy just so I can comment out the first parse easily
  .then(parsedSongs => utils.parseUrlList('data/urlList2010.txt', parsedSongs, {'decade': '2010'}))
  .then(parsedSongs => utils.parseUrlList('data/urlList2000.txt', parsedSongs, {'decade': '2000'}))
  .then(parsedSongs => utils.parseUrlList('data/urlList1990.txt', parsedSongs, {'decade': '1990'}))
  .then(parsedSongs => utils.parseUrlList('data/urlList1980.txt', parsedSongs, {'decade': '1980'}))
  .then(parsedSongs => utils.parseUrlList('data/urlList1970.txt', parsedSongs, {'decade': '1970'}))
  .then(parsedSongs => utils.parseUrlList('data/urlList1960.txt', parsedSongs, {'decade': '1960'}))
  .then(parsedSongs => utils.parseUrlList('data/urlList1950.txt', parsedSongs, {'decade': '1950'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListCountry.txt', parsedSongs, {'genre': 'Country'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListElectronic.txt', parsedSongs, {'genre': 'Electronic'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListFolk.txt', parsedSongs, {'genre': 'Folk'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListMetal.txt', parsedSongs, {'genre': 'Metal'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListPop.txt', parsedSongs, {'genre': 'Pop'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListRhythmAndBlues.txt', parsedSongs, {'genre': 'RhythmAndBlues'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListRock.txt', parsedSongs, {'genre': 'Rock'}))
  .then(parsedSongs => { fs.writeFileSync('data/parsedSongs.json', JSON.stringify(parsedSongs), 'utf8'); });
