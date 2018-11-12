/**
 * Script used for parsing songs
 */

/* global require */
const utils = require('./utils.js');
const fs = require('fs');

let parsedSongs = JSON.parse(fs.readFileSync('data/parsedSongs.json', 'utf8'));

(new Promise(resolve => {resolve(parsedSongs);})) // dummy just so I can comment out the first parse easily
  // .then(parsedSongs => utils.parseUrlList('data/urlList2010.txt', parsedSongs, {'decade': '2010'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlList2000.txt', parsedSongs, {'decade': '2000'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlList1990.txt', parsedSongs, {'decade': '1990'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlList1980.txt', parsedSongs, {'decade': '1980'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlList1970.txt', parsedSongs, {'decade': '1970'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlList1960.txt', parsedSongs, {'decade': '1960'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlList1950.txt', parsedSongs, {'decade': '1950'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListCountry.txt', parsedSongs, {'genre': 'Country'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListElectronic.txt', parsedSongs, {'genre': 'Electronic'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListFolk.txt', parsedSongs, {'genre': 'Folk'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListMetal.txt', parsedSongs, {'genre': 'Metal'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListPop.txt', parsedSongs, {'genre': 'Pop'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListRhythmAndBlues.txt', parsedSongs, {'genre': 'RhythmAndBlues'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListRock.txt', parsedSongs, {'genre': 'Rock'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListGb.txt', parsedSongs, {'tonality': 'Gb'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListEbm.txt', parsedSongs, {'tonality': 'Ebm'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListAbm.txt', parsedSongs, {'tonality': 'Abm'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListDb.txt', parsedSongs, {'tonality': 'Db'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListGbm.txt', parsedSongs, {'tonality': 'Gbm'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListEb.txt', parsedSongs, {'tonality': 'Eb'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListBb.txt', parsedSongs, {'tonality': 'Bb'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListCm.txt', parsedSongs, {'tonality': 'Cm'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListB.txt', parsedSongs, {'tonality': 'B'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListBm.txt', parsedSongs, {'tonality': 'Bm'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListF.txt', parsedSongs, {'tonality': 'F'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListDm.txt', parsedSongs, {'tonality': 'Dm'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListE.txt', parsedSongs, {'tonality': 'E'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListA.txt', parsedSongs, {'tonality': 'A'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListEm.txt', parsedSongs, {'tonality': 'Em'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListD.txt', parsedSongs, {'tonality': 'D'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListAm.txt', parsedSongs, {'tonality': 'Am'}))
  // .then(parsedSongs => utils.parseUrlList('data/urlListG.txt', parsedSongs, {'tonality': 'G'}))
  .then(parsedSongs => utils.parseUrlList('data/urlListC.txt', parsedSongs, {'tonality': 'C'}))
  .then(parsedSongs => { fs.writeFileSync('data/parsedSongs.json', JSON.stringify(parsedSongs), 'utf8'); });
