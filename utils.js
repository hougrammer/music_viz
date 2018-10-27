/* global module require */
const ugs = require('../ultimate-guitar-scraper/lib/index.js');
const fs = require('fs');
const cheerio = require('cheerio');

const debug = true;

/**
 * Extracts raw chords from 
 * @param  {String} text - text of tab.content
 * @return {String[]} raw chords
 */
function extractRawChords(text) {
  return text
    .match(/\[ch\].*?\[\/ch\]/g) // grab all the chords
    .map(x => x.substring(4, x.length - 5)); // throw out the [ch] and [/ch]
}

/**
 * Simplifies raw chords.  For our purposes everything is a major chord
 * except for minor and diminished.  We're ignoring 7 chords and stuff like that.
 * @param  {String[]} chords - array of raw chords
 * @return {String[]} array of simplified chords
 */
function simplifyChords(chords) {
  return chords.map(c => {
    let note = c[0];
    if (c.length === 1) return note;

    let suffix = c.substring(1, c.length);

    // take care sharps and flats
    if (c[1] === '#' || c[1] === 'b') {
      note += c[1];
      suffix = c.substring(2, c.length);
    }

    switch (suffix) {
      case '': return note;
      case 'm': return note + 'm';
      default:
        if (suffix.substring(0,3) === 'dim') return note + 'm';
        if (suffix.substring(0,3) === 'maj') return note;
        if (suffix[0] === 'm') return note + 'm';
        return note;
    }
  });
}

/**
 * Parses a url list in the form of txt and returns an array of promises
 * that resolve the song information
 * @param  {String[]} urls - array of urls
 * @param  {Set} skipSongs - set of songs that are being skipped
 * @param  {Object} info - extra information (e.g. decade)
 * @return {Promise[]} songs as promises, use with Promise.all()
 */
function parseUrlList(urls, skipSongs, info) {
  let songs = [];

  urls.forEach((url) => {
    let songPromise = new Promise((resolve, reject) => {
      ugs.get(url, (err, tab) => {
        if (err) reject(err);

        if (skipSongs.has(tab.name)) {
          if (debug) console.log('Skipping ' + tab.name + ' because it has already been parsed.');
          resolve(null);
        } else {
          if (debug) console.log('Parsing ' + tab.name + '...');

          let song = {};
          song.name = tab.name;
          song.artist = tab.artist;
          song.capo = tab.capo;
          song.tonality = tab.tonality;
          song.tuning = tab.tuning;
          song.rawChords = extractRawChords(tab.content.text);
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

module.exports = {
  extractRawChords,
  simplifyChords,
  parseUrlList
};