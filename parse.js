/* global require */
const ugs = require('../ultimate-guitar-scraper/lib/index.js');
const utils = require('./utils');
const fs = require('fs');

const tabUrl = 'https://tabs.ultimate-guitar.com/tab/imagine_dragons/radioactive_chords_1171909';

ugs.get(tabUrl, (error, tab) => {
  if (error) {
    console.log(error);
  } else {
    console.log(utils.extractRawChords(tab.content.text));
  }
});