/* global vegaEmbed */

var vlSpec = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
  'data': {
    'url': 'data/keyCounts.json'
  },

  'mark': 'bar',
  'encoding': {
    'y': {
      'field': 'major',
      'type': 'quantitative',
      'axis': {
        'title': 'Count'
      }
    },
    'x': {
      'field': 'note',
      'type': 'nominal',
      'axis': {
        'title': 'Note'
      }
    }
  }



};

// Embed the visualization in the container with id `vis`
vegaEmbed('#vis', vlSpec);