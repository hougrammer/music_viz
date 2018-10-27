/* global module require */
const ugs = require('../ultimate-guitar-scraper/lib/index.js');
const fs = require('fs');

const debug = true;

/**
 * @param  {string} text of tab.content
 * @return {array} raw chords
 */
function extractRawChords(text) {
  return text
    .match(/\[ch\].*?\[\/ch\]/g) // grab all the chords
    .map(x => x.substring(4, x.length - 5)); // throw out the [ch] and [/ch]
}

// const promises = []  // collect all promises here
// items.forEach(item => {
//     const promise = item.doWork()
//     promises.push(promise)
// })
// Promise.all(promises).then(results => {
//     // continue processing here
//     // results[0] is the result of the first promise in the promises array
// })

function parseUrlList(urls, skipSongs, info) {
  let songs = [];

  urls.forEach((url) => {
    let songPromise = new Promise((resolve, reject) => {
      ugs.get(url, (err, tab) => {
        if (err) reject(err);

        if (skipSongs.has(tab.name)) {
          if (debug) console.log('Skipping ' + tab.name + ' because it has already been parsed.');
          resolve(null);
        }
        else {
          if (debug) console.log('Parsing ' + tab.name + '...');

          let song = {};
          song.name = tab.name;
          song.artist = tab.artist;
          song.capo = tab.capo;
          song.tonality = tab.tonality;
          song.tuning = tab.tuning;
          song.chords = extractRawChords(tab.content.text);
          song.decade = info.decade;

          skipSongs.add(song.name);
          resolve(song);
        }
        
      });
    });
    songs.push(songPromise);
  });
  return songs;
}

// function parseUrlList(urls, skipSongs, info) {
//   return new Promise((resolve, reject) => {
//     let songs = [];
//     let i = 0;
//     urls.forEach((url, _, array) => {

//       ugs.get(url, (err, tab) => {
//         if (err) reject(err);

//         i++;
//         console.log(i, array.length, songs.length)
//         if (skipSongs.has(tab.name)) {
//           if (debug) console.log('Skipping ' + tab.name + ' because it has already been parsed.');
//           return;
//         }
//         if (debug) console.log('Parsing ' + tab.name + '...');

//         let song = {};
//         song.name = tab.name;
//         song.artist = tab.artist;
//         song.capo = tab.capo;
//         song.tonality = tab.tonality;
//         song.tuning = tab.tuning;
//         song.chords = extractRawChords(tab.content.text);
//         song.decade = info.decade;

//         skipSongs.add(song.name);
//         songs.push(song);
//         if (i === array.length-1) {
//           resolve(songs);
//         }
//       });

//     });

//   });

// }

module.exports = {
  extractRawChords,
  parseUrlList
};