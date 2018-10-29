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
  let match = text.match(/\[ch\].*?\[\/ch\]/g);
  return match === null ? [] : match.map(x => x.substring(4, x.length - 5));
}

/**
 * Simplifies raw chords.  For our purposes everything is a major chord
 * except for minor and diminished.  We're ignoring 7 chords and stuff like that.
 * @param  {String[]} chords - array of raw chords
 * @return {String[]} array of simplified chords
 */
function simplifyChords(chords) {
  const notes = 'ABCDEFG';
  return chords.map(c => {
    let note = c[0];
    if (c.length === 1) return note;

    let suffix = c.substring(1, c.length);

    // convert sharps and flats to one note
    if (c[1] === 'b') {
      let low = note === 'A' ? 'G' : notes[notes.indexOf(note)-1]; // G#/Ab
      note = low + '#/' + note + 'b'; // e.g. C#/Db
      suffix = c.substring(2, c.length);
    }
    else if (c[1] === '#') {
      let high = note === 'G' ? 'A' : notes[notes.indexOf(note)+1]; // G#/Ab
      note = note + '#/' + high + 'b'; // e.g. C#/Db
      suffix = c.substring(2, c.length);
    }

    switch (suffix) {
      case '':
        return note;
      case 'm':
        return note + ' minor';
      default:
        if (suffix.substring(0, 3) === 'dim') return note + ' minor'; // Adim
        if (suffix.substring(0, 3) === 'maj') return note; // Amaj
        if (suffix[0] === 'm') return note + ' minor'; // Am7
        return note; // Asus, A7, etc
    }
  });
}

/**
 * Grabs all the tab urls off a page and writes it to a text file.
 * @param  {String} url
 * @param  {String} filePath
 */
function writeUrlList(url, filePath) {
  const requestOptions = {
    url: url,
    followRedirect: false
  };
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
      if (index !== array.length - 1) fs.appendFileSync(filePath, '\n');
    });
  });
}

/**
 * Helper function to aggregate chords in a song object
 * @param  {Object} song
 */
function aggregateChords(song) {
  const chords = [
    'A', 'A minor',
    'A#/Bb', 'A#/Bb minor',
    'B', 'B minor',
    'C', 'C minor',
    'C#/Db', 'C#/Db minor',
    'D', 'D minor',
    'D#/Eb', 'D#/Eb minor',
    'E', 'E minor',
    'F', 'F minor',
    'F#/Gb', 'F#/Gb minor',
    'G', 'G minor',
    'G#/Ab', 'G#/Ab minor'
  ];
  chords.forEach(chord => {
    song[chord] = 0;
  });

  let set = new Set();
  song.simplifiedChords.forEach(chord => {
    song[chord] += 1;
    set.add(chord);
  });
  song.uniqueChords = set.size;
  song.totalChords = song.simplifiedChords.length;
}

/**
 * Parses a url list in the form of txt and returns a promise
 * that resolves to an updated version of the parsedSongs object
 * @param  {String} filePath
 * @param  {Object[]} parsedSongs
 * @param  {Object} info - extra information (e.g. decade)
 * @return {Promise} resolves to updated parsedSongs
 */
function parseUrlList(filePath, parsedSongs, info) {
  if (debug) console.log('\n\nURL path: ' + filePath);
  let songs = [];
  info = info || {};

  let songMap = {};
  parsedSongs.forEach((song, index) => {
    songMap[song.songName] = index;
  });

  let urls = fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .filter(line => line.indexOf('http') === 0); // allows us to put other comments without breaking parser
  urls.forEach((url) => {
    let songPromise = new Promise((resolve, reject) => {
      ugs.get(url, (err, tab) => {
        if (err) { // should probably reject here, figure out how to handle later
          if (debug) console.log('ugs get error: ' + url + ', ' + err)
          resolve(null);
        }

        else if (tab === null) { // Sometimes tab is null. Don't know why. Just skip it.
          if (debug) console.log('tab is null for ' + url);
          resolve(null);
        }

        else if (tab.name in songMap &&
          songMap[tab.name] !== null &&
          parsedSongs[songMap[tab.name]].artist === tab.artist) {
          if (debug) console.log(tab.name + ' previously parsed.  Just updating info.');

          let song = parsedSongs[songMap[tab.name]];
          if (info.decade !== undefined) song.decade = info.decade;
          if (info.genre !== undefined) song.genre = info.genre;

          resolve(null);
        }

        else if (tab.name in songMap) {
          if (debug) console.log('Skipping ' + tab.name + '.  Repeated in this url list.');

          resolve(null);
        }

        else {
          if (debug) console.log('Parsing ' + tab.name + '...');

          let song = {};

          // basic song info
          song.songName = tab.name;
          song.artist = tab.artist;
          song.capo = tab.capo;
          song.tonality = tab.tonality;
          song.tuning = tab.tuning;
          song.rawChords = extractRawChords(tab.content.text);
          song.simplifiedChords = simplifyChords(song.rawChords);
          aggregateChords(song);

          // any additional info
          song.decade = info.decade;
          song.genre = info.genre;

          songMap[tab.name] = null; // not sure of index until promises resolve
          resolve(song);
        }

      });
    });
    songs.push(songPromise);
  });

  return Promise.all(songs).then(songs => {
    parsedSongs.push(...songs.filter(x => x !== null));
    return parsedSongs;
  });

}

module.exports = {
  extractRawChords,
  simplifyChords,
  writeUrlList,
  parseUrlList
};