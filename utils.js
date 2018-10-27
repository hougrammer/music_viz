/* global module require */
const ugs = require('../ultimate-guitar-scraper/lib/index.js');
const fs = require('fs');
const request = require('request');
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
 * Grabs all the tab urls off a page and writes it to a text file.
 * @param  {String} url
 * @param  {String} filePath
 */
function writeUrlList (url, filePath){
  const requestOptions = {url: url, followRedirect: false};
  const varName = 'window.UGAPP.store.page';

  request.get(requestOptions, (err, response, html) => {
    let $ = cheerio.load(html);
    
    // look for a script with the varName
    let script = $('script').toArray().find(script => 
      $(script).html().indexOf(varName) !== -1
    );

    let raw = script.children[0].data;
    let json = JSON.parse(raw.substring(raw.indexOf('{'), raw.indexOf(';')));
    json.data.data.tabs.forEach((tab, index, array) => {
      fs.appendFileSync(filePath, tab.tab_url);
      if (index !== array.length-1) fs.appendFileSync('\n');
    });
  });
}

/**
 * Parses a url list in the form of txt and returns an array of promises
 * that resolve the song information
 * @param  {String[]} filePath - urls separated by \n
 * @param  {Set} songSet - set of songs that have been previously parsed
 * @param  {Object} info - extra information (e.g. decade)
 * @return {Promise[]} songs as promises, use with Promise.all()
 */
function parseUrlList(filePath, songSet, info) {
  let songs = [];
  info = info || {};

  let urls = fs.readFileSync(filePath, 'utf8').split('\n');
  urls.forEach((url) => {
    let songPromise = new Promise((resolve, reject) => {
      ugs.get(url, (err, tab) => {
        if (err) reject(err);

        if (songSet.has(tab.name)) {
          if (debug) console.log('Skipping ' + tab.name + ', song name already parsed.');
          resolve(null);
        } else {
          if (debug) console.log('Parsing ' + tab.name + '...');

          let song = {};

          // basic song info
          song.name = tab.name;
          song.artist = tab.artist;
          song.capo = tab.capo;
          song.tonality = tab.tonality;
          song.tuning = tab.tuning;
          song.rawChords = extractRawChords(tab.content.text);
          song.simplifedChords = simplifyChords(song.rawChords);

          // any additional info
          song.decade = info.decade;
          song.genre = info.genre;

          songSet.add(song.name);
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
  writeUrlList,
  parseUrlList
};