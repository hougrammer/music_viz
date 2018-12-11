/* global d3 */
function plotChordsViz() {
  var rooti = 12;
  var major = true;
  function highlightChord() {
    let idx = [rooti, rooti+4, rooti+7];
    let notes = [];

    if (!major) idx[1] -= 1;

    rects.each(function(d) {
      let that = d3.select(this);
      if (idx.indexOf(d.i) != -1) {
        that.attr('fill', 'lightblue');
        notes.push(d);
      }
      else {
        that.attr('fill', dd => dd.fill);
      }
    });

    notes.sort((a,b) => a.i - b.i);
    d3.select('#chordSpan').html(notes[0].note + (major ? ' Major' : ' Minor'));
    d3.select('#noteSpan').html(notes[0].note + ', ' + notes[1].note + ', ' + notes[2].note);
    
  }

  let height = 110;
  let width = 460;
  let margin = { top: 5, right: 5, bottom: 5, left: 5 };
  let h = height - margin.top - margin.bottom;
  let w = width - margin.left - margin.right;

  let whiteN = 21;
  let whiteWidth = w / whiteN;
  let whiteX = d3.range(0, w, whiteWidth);
  let blackX = [];
  let blackWidth = .7*whiteWidth;
  let blackHeight = .65*h;

  for (let i = 0; i < whiteX.length; i++) {
    if (i%7 == 0 || i%7 == 3) continue;
    blackX.push(whiteX[i] - blackWidth/2);
  }

  let whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  let blackNotes = ['C#/Db', 'D#/Eb', 'F#/Gb', 'G#/Ab', 'A#/Bb'];

  let keys = [];
  let wi = 0, bi = 0;
  // have to use 2 for loops because svg doesnt support z-index
  // and we need the black keys to be drawn after the white ones
  for (let i = 0; i < 36; i++) {
    let mod = i%12;
    if (mod!=1 && mod!=3 && mod!=6 && mod!=8 && mod!=10) {
      // white keys
      let key = {};
      key.x = whiteX[wi];
      key.height = h;
      key.width = whiteWidth;
      key.fill = 'white';
      key.stroke = 'grey';
      key.note = whiteNotes[wi++ % 7];
      key.i = i;
      keys.push(key);
    }
  }
  for (let i = 0; i < 36; i++) {
    let mod = i%12;
    if (mod==1 || mod==3 || mod==6 || mod==8 || mod==10) {
      // black keys
      let key = {};
      key.x = blackX[bi];
      key.height = blackHeight;
      key.width = blackWidth;
      key.fill = 'black';
      key.stroke = 'black';
      key.note = blackNotes[bi++ % 5];
      key.i = i;
      keys.push(key);
    }
  }
  // create svg
  let svg = d3.select('#chordsViz')
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // create rects for keys
  let rects = svg.selectAll('rect')
    .data(keys)
    .enter()
    .append('rect')
    .attr('x', d => d.x)
    .attr('fill', d => d.fill)
    .attr('stroke', d => d.stroke)
    .attr('height', d => d.height)
    .attr('width', d => d.width)
    .attr('cursor', 'pointer')
    .on('click', d => {
      rooti = d.i;
      highlightChord();
    });

  highlightChord();

  // handle major/minor
  d3.selectAll(('input.chordsRadio'))
    .on('change', function(){
      major = this.value === 'Major';
      highlightChord();
    });
}
plotChordsViz();