/* global d3*/

function plot(data, height, width) {

  let plotCircles = function(top) {

    let percents = [];
    let total = data[top].total;
    for (let chord in data[top]) {
      if (chord !== 'total') percents.push([chord, data[top][chord]/total]);
    }

    svg.select('circle.root').remove();
    svg.selectAll('circle.leaf').remove();
    svg.select('text.root').remove();
    svg.selectAll('text.leaf').remove();

    svg.append('circle')
      .attr('class', 'root')
      .attr('stroke', 'black')
      .attr('fill', colorScale(maxPercent))
      .attr('r', 20)
      .transition()
      .duration(1000)
      .attr('cx', xScale(.5))
      .attr('cy', yScale(.1));

    svg.append('text')
      .attr('class', 'root')
      .text(top)
      .style('text-anchor', 'middle')
      .style('font-size', 10)
      .style('fill', colorScale(0))
      .transition()
      .duration(1000)
      .attr('x', xScale(.5))
      .attr('y', yScale(.1));

    svg.selectAll('circle.leaf')
      .data(percents)
      .enter()
      .append('circle')
      .attr('class', 'leaf')
      .attr('stroke', 'black')
      .attr('fill', d => colorScale(d[1]))
      .attr('r', 20)
      .on('mouseover', onCircleMouseOver)
      .on('mousemove', onCircleMouseMove)
      .on('mouseout', onCircleMouseOut)
      .on('click', onCircleClick)
      .transition()
      .duration(1000)
      .attr('cx', d => circleX[d[0]])
      .attr('cy', d => d[0].indexOf('#') === -1 ? keyboardY + whiteHeight - 30: keyboardY + blackHeight - 30);

    svg.selectAll('text.leaf')
      .data(percents)
      .enter()
      .append('text')
      .attr('class', 'leaf')
      .text(d => d[0])
      .style('text-anchor', 'middle')
      .style('font-size', 10)
      .style('fill', d => colorScale(maxPercent - d[1]))
      .on('mouseover', onCircleMouseOver)
      .on('mousemove', onCircleMouseMove)
      .on('mouseout', onCircleMouseOut)
      .on('click', onCircleClick)
      .transition()
      .duration(1000)
      .attr('x', d => circleX[d[0]])
      .attr('y', d => d[0].indexOf('#') === -1 ? keyboardY + whiteHeight - 30: keyboardY + blackHeight - 30);
      
  };
  // event handlers
  var onCircleMouseOver = function(d) {
    // d3.select(this).transition()
    //   .duration(200)
    //   .attr('r', 30);
    d3.select(this)
      .style('cursor', 'pointer');
    tooltip.transition()
      .duration(200)
      .style('visibility', 'visible');

    var text = 'Chord: ' + d[0] + '<br>' +
      'Percent: ' + (100*d[1]).toFixed(1) + '%';
    tooltip.html(text)
      .style('top', (event.pageY - 10) + 'px')
      .style('left', (event.pageX + 15) + 'px');
  };
  var onCircleMouseMove = function() {
    tooltip
      .style('top', (event.pageY - 10) + 'px')
      .style('left', (event.pageX + 15) + 'px');
  };
  var onCircleMouseOut = function() {
    // d3.select(this).transition()
    //   .duration(200)
    //   .attr('r', 20);

    tooltip.transition()
      .duration(500)
      .style('visibility', 'hidden');
  };
  var onCircleClick = function(d) {
    tooltip.style('visibility', 'hidden');
    plotCircles(d[0]);
  };

  // margins, height, and width
  let margin = { top: 50, right: 100, bottom: 100, left: 50 };
  if (height === undefined) height = 500;
  if (width === undefined) width = 1000;
  let h = height - margin.top - margin.bottom;
  let w = width - margin.left - margin.right;

  // scales
  let xScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, w])
    .nice();
  let yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, h])
    .nice();
  // let maxPercent = 0;
  // for (let c1 in data) {
  //   let n = data[c1].total;
  //   for (let c2 in data[c1]) {
  //     if (c2 !== 'total')
  //       maxPercent = Math.max(maxPercent, data[c1][c2]/n);
  //   }
  //   console.log(c1, maxPercent)
  // }
  var maxPercent = .4;
  let colorScale = d3.scaleSequential(d3.interpolateBlues)
    .domain([0, maxPercent]);

  // create plot area
  let svg = d3.select('#progressionPlot')
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // create tooltip
  var tooltip = d3.select('body').append('div')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .style('background', 'rgba(255, 255, 255, .8)')
    .style('font-size', 12);

  //create keyboard
  let whiteX = d3.range(0, w, w/7);
  let blackX = [];
  let whiteWidth = w/7;
  let whiteHeight = .75*h;
  let blackWidth = .75*whiteWidth;
  let blackHeight = .75*whiteHeight;

  for (let i = 1; i < whiteX.length; i++) {
    if (i === 3) continue;
    blackX.push(whiteX[i] - blackWidth/2);
  }
  
  let keyboardY = h - whiteHeight;
  let keyboard = svg.append('g')
    .attr('transform', 'translate(0,' + keyboardY + ')');
  // using wKey and bKey to not conflict with css from whiteKey and blackKey
  keyboard.selectAll('rect.wKey')
    .data(whiteX)
    .enter()
    .append('rect')
    .attr('class', 'wKey')
    .attr('x', d => d)
    .attr('fill', 'white')
    .attr('stroke', 'black')
    .attr('width', whiteWidth)
    .attr('height', whiteHeight);
  keyboard.selectAll('rect.bKey')
    .data(blackX)
    .enter()
    .append('rect')
    .attr('class', 'bKey')
    .attr('x', d => d)
    .attr('fill', 'black')
    .attr('stroke', 'black')
    .attr('width', blackWidth)
    .attr('height', blackHeight);

  // figure out circle locations
  let majorOffset = .25;
  let minorOffset = .75;
  let circleX = {
    'C': whiteX[0] + majorOffset * whiteWidth,
    'C#/Db': blackX[0] + majorOffset * blackWidth,
    'D': whiteX[1] + majorOffset * whiteWidth,
    'D#/Eb': blackX[1] + majorOffset * blackWidth,
    'E': whiteX[2] + majorOffset * whiteWidth,
    'F': whiteX[3] + majorOffset * whiteWidth,
    'F#/Gb': blackX[2] + majorOffset * blackWidth,
    'G': whiteX[4] + majorOffset * whiteWidth,
    'G#/Ab': blackX[3] + majorOffset * blackWidth,
    'A': whiteX[5] + majorOffset * whiteWidth,
    'A#/Bb': blackX[4] + majorOffset * blackWidth,
    'B': whiteX[6] + majorOffset * whiteWidth,
    'C minor': whiteX[0] + minorOffset * whiteWidth,
    'C#/Db minor': blackX[0] + minorOffset * blackWidth,
    'D minor': whiteX[1] + minorOffset * whiteWidth,
    'D#/Eb minor': blackX[1] + minorOffset * blackWidth,
    'E minor': whiteX[2] + minorOffset * whiteWidth,
    'F minor': whiteX[3] + minorOffset * whiteWidth,
    'F#/Gb minor': blackX[2] + minorOffset * blackWidth,
    'G minor': whiteX[4] + minorOffset * whiteWidth,
    'G#/Ab minor': blackX[3] + minorOffset * blackWidth,
    'A minor': whiteX[5] + minorOffset * whiteWidth,
    'A#/Bb minor': blackX[4] + minorOffset * blackWidth,
    'B minor': whiteX[6] + minorOffset * whiteWidth,
  };

  plotCircles('Start');
}

d3.json('data/nextChords.json').then(data => { plot(data); });