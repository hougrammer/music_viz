/* global d3 */
function songScatter(data) {
  var filterByGenre = false;
  function onCircleMouseOver(d) {
    d3.select(this).transition()
      .duration(200)
      .attr('r', 10);

    tooltip.transition()
      .duration(200)
      .style('visibility', 'visible');

    let text = '<b>Artist: </b>' + d.artist + '<br>' +
      '<b>Song: </b>' + d.songName + '<br>' +
      (d.genre !== undefined ? '<b>Genre: </b>' + d.genre + '<br>' : '') +
      (d.decade !== undefined ? '<b>Decade: </b>' + d.decade + '<br>' : '') +
      '<b>Total Chords: </b>' + d.totalChords + '<br>' +
      '<b>Unique Chords: </b>' + d.uniqueChords;
    tooltip.html(text)
      .style('top', (event.pageY - 10) + 'px')
      .style('left', (event.pageX + 12) + 'px');
  }

  function onCircleMouseMove() {
    tooltip
      .style('top', (event.pageY - 10) + 'px')
      .style('left', (event.pageX + 12) + 'px');
  }

  function onCircleMouseOut() {
    d3.select(this).transition()
      .duration(200)
      .attr('r', 5);

    tooltip.transition()
      .duration(500)
      .style('visibility', 'hidden');
  }

  function updateMeans() {
    let total = d3.mean(data.filter(d => !d.filtered), d => d.totalChords);
    let unique = d3.mean(data.filter(d => !d.filtered), d => d.uniqueChords);
    xMeanLine
      .transition()
      .duration(500)
      .attr('x1', xScale(total))
      .attr('x2', xScale(total))
      .attr('y1', 0)
      .attr('y2', h + .25*margin.bottom);
    xMeanText
      .transition()
      .duration(500)
      .text('mean:' + total.toFixed(1))
      .attr('x', xScale(total))
      .attr('y', h + .25*margin.bottom);
    yMeanLine
      .transition()
      .duration(500)
      .attr('x1', 0)
      .attr('x2', w)
      .attr('y1', yScale(unique))
      .attr('y2', yScale(unique));
    yMeanText
      .transition()
      .duration(500)
      .text('mean:' + unique.toFixed(1))
      .attr('x', w - 55)
      .attr('y', yScale(unique) - 10);
  }

  function onCellClick() {
    legend.selectAll('text').attr('font-weight', 'normal');
    let label = d3.select(this).select('.label');
    let text = label.text();
    label.attr('font-weight', 'bold');
    data.forEach(d => {
      if (filterByGenre) d.filtered = d.genre !== text;
      else d.filtered = d.decade !== text;
    });
    circles.transition()
      .duration(200)
      .attr('r', d => d.filtered ? 0 : 5);
    updateMeans();

  }

  function resetPoints() {
    data.forEach(d => {d.filtered = false;});
    legend.selectAll('text').attr('font-weight', 'normal');
    circles.transition()
      .duration(200)
      .attr('r', 5);
    updateMeans();
  }

  function updateFilter() {
    resetPoints();
    colorScale.domain(filterByGenre ? genres : decades);
    circles.transition()
      .duration(200)
      .attr('fill', d => colorScale(filterByGenre ? d.genre : d.decade))
      .attr('r', 5);
    legendCall.title(filterByGenre ? 'Genre' : 'Decade');
    legend.call(legendCall);
    updateMeans();
  }
    

  data.forEach(d => {
    if (d.genre === undefined) d.genre = 'Unlisted';
    else if (d.genre === 'RhythmAndBlues') d.genre = 'R&B';
    if (d.decade === undefined) d.decade = 'Unlisted';
    d.filtered = false;
  });
  // filter out albums and empty songs
  let albums = ['Red', 'Harvest Moon', 'Unplugged']
  data = data.filter(d => albums.indexOf(d.songName) == -1 && d.totalChords);

  // margins, height, and width
  let margin = { top: 50, right: 110, bottom: 100, left: 100 };
  let height = 600;
  let width = 1000;
  let h = height - margin.top - margin.bottom;
  let w = width - margin.left - margin.right;

  // create plot area
  let svg = d3.select('#songScatter')
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  

  // scales
  let xScale = d3.scaleLinear()
    .domain([0, 1 + d3.max(data, d => d.totalChords)])
    .range([0, w])
    .nice();
  let yScale = d3.scaleLinear()
    .domain([0, 1 + d3.max(data, d => d.uniqueChords)])
    .range([h, 0])
    .nice();
  let genres = ['Unlisted', 'Country', 'Electronic', 'Folk', 'Metal', 'Pop', 'R&B', 'Rock'];
  let decades = ['Unlisted', '1950', '1960', '1970', '1980', '1990', '2000', '2010'];
  let colorScale = d3.scaleOrdinal()
    .domain(genres)
    .range(d3.schemeCategory10);

  // create mean line
  let xMeanLine = svg.append('line')
    .style('stroke', 'grey');
  let yMeanLine = svg.append('line')
    .style('stroke', 'grey');

  // create mean text
  let xMeanText = svg.append('text')
    .attr('font-size', '8pt')
    .attr('dx', 5)
    .attr('dy', 3);
  let yMeanText = svg.append('text')
    .attr('font-size', '8pt')
    .attr('dx', 5)
    .attr('dy', 3);
  
  // create background for reset
  svg.append('rect')
    .attr('class', 'background')
    .attr('width', w)
    .attr('height', h)
    .style('fill', 'white')
    .style('opacity', 0)
    .on('click', resetPoints);
  
  // x-axis and grid
  var xAxis = d3.axisBottom(xScale);
  var xGrid = d3.axisBottom(xScale).tickSize(h).tickFormat('');
  svg.append('g')
    .attr('transform', 'translate(0,' + h + ')')
    .call(xAxis);
  svg.append('text')
    .attr('x', (w / 2))
    .attr('y', (h + margin.bottom / 2))
    .style('text-anchor', 'middle')
    .text('Total Chords');
  svg.append('g')
    .call(xGrid)
    .selectAll('line')
    .style('stroke', 'lightgrey')
    .style('stroke-opacity', .7);

  // y-axis and grid
  var yAxis = d3.axisLeft(yScale);
  var yGrid = d3.axisLeft(yScale).tickSize(-w).tickFormat('');
  svg.append('g')
    .call(yAxis);
  svg.append('text')
    .attr('x', -(h / 2))
    .attr('y', -(margin.left / 2))
    .attr('transform', 'rotate(-90)') // causes x and y to flip
    .style('text-anchor', 'middle')
    .text('Unique Chords');
  svg.append('g')
    .call(yGrid)
    .selectAll('line')
    .style('stroke', 'lightgrey')
    .style('stroke-opacity', .7);

  // create tooltip
  let tooltip = d3.select('body').append('div')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .style('background', 'rgba(255, 255, 255, .8)')
    .style('font-size', '12px');

  let circles = svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d.totalChords))
    .attr('cy', d => yScale(d.uniqueChords))
    .attr('r', 5)
    .attr('fill', d => colorScale(d.decade))
    .on('mouseover', onCircleMouseOver)
    .on('mousemove', onCircleMouseMove)
    .on('mouseout', onCircleMouseOut);
    
  // legend
  let legendCall = d3.legendColor()
    .orient('vertical')
    .scale(colorScale)
    .title('Genre')
    .on('cellclick', onCellClick);
  let legend = svg.append('g')
    .call(legendCall)
    .attr('transform', 'translate(' + (w + 10) + ',' + 0 + ')')
    .attr('cursor', 'pointer');

  d3.selectAll(('input.songRadio'))
    .on('change', function(){
      filterByGenre = this.value === 'Genre';
      updateFilter();
    });

  // chart title
  svg.append('text')
    .text('Total Chords vs Unique Chords in Songs')
    .attr('font-size', '18pt')
    .attr('font-weight', 'bold')
    .attr('dy', -10);

  updateMeans();
  updateFilter();

}
d3.json('data/parsedSongs.json').then(data => { songScatter(data); });