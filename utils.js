/* global module */

/**
 * @param  {string} text of tab.content
 * @return {array} raw chords
 */
function extractRawChords(text) {
  return text
    .match(/\[ch\].*?\[\/ch\]/g) // grab all the chords
    .map(x => x.substring(4, x.length-5)); // throw out the [ch] and [/ch]
}

module.exports = {
  extractRawChords
};