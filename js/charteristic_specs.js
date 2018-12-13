var musicChars1Spec =  {

    "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
    "data": { "name": "music-billboard-data" },
    "transform": [{"filter": { "selection": "genre"}}],
    "hconcat": [{
      "width" : 500, "height" : 300,

    "mark": "circle",
    "selection": {
        "genre": {
          "type": "single",
          "fields": ["broad_genre"],
          "bind": {"input": "select", "name": "Genre", "options": genres}
        }
    },
    "encoding": {
      "y": {
        "field": "year",
        "type": "ordinal",
        "timeUnit": "year"
      },
      "x": {
        "bin": {"step" : 1.75},
        "field": "loudness",
        "type": "quantitative"
      },
      "size": {
        "field": "weeks",
        "type": "quantitative",
        "aggregate": "sum"
      }
      }
    }
]
}


var genreHeatMapSpec = 
{
  "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
  "data": { "name": "music-billboard-data" },


  "vconcat" : [{

    "hconcat" : [{
      "transform": [{"filter": { "selection": "genre"}}],
      "selection": {
        "genre": {
          "type": "single",
          "fields": ["broad_genre"],
          "bind": {"input": "select", "name": "Genre", "options": genres}
        }
      },
    
      "mark": "rect",
      "width": 250,
      "height": 200,
      "encoding": {
        "x": {
          "bin": {"step" : .125},
          "field": "energy",
          "type": "quantitative"
        },
        "y": {
          "field": "year",
          "type": "ordinal",
          "timeUnit": "year",
          "axis" : {"title": null}
        },
        "color": {
          "aggregate": "count",
          "type": "quantitative"
        },
      }
      },
      {
      "transform": [{"filter": { "selection": "genre"}}],
      "selection": {
        "genre": {
          "type": "single",
          "fields": ["broad_genre"],
          "bind": {"input": "select", "name": "Genre", "options": genres}
        }
      },
    
      "mark": "rect",
      "width": 250,
      "height": 200,
      "encoding": {
        "x": {
          "bin": {"step" : 25},
          "field": "tempo",
          "type": "quantitative"
        },
        "y": {
          "field": "year",
          "type": "ordinal",
          "timeUnit": "year",
          "axis" : null
        },
        "color": {
          "aggregate": "count",
          "type": "quantitative"
        },
      }
      },
      {
        "transform": [{"filter": { "selection": "genre"}}],
        "selection": {
          "genre": {
            "type": "single",
            "fields": ["broad_genre"],
            "bind": {"input": "select", "name": "Genre", "options": genres}
          }
        },
      
        "mark": "rect",
        "width": 250,
        "height": 200,
        "encoding": {
          "x": {
            "bin": {"step" : .125},
            "field": "danceability",
            "type": "quantitative"
          },
          "y": {
            "field": "year",
            "type": "ordinal",
            "timeUnit": "year",
            "axis" : null
          },
          "color": {
            "aggregate": "count",
            "type": "quantitative"
          },
        }
        }
    
    ]},
    {  
    "hconcat": [{
    "transform": [{"filter": { "selection": "genre"}}],
    "selection": {
      "genre": {
        "type": "single",
        "fields": ["broad_genre"],
        "bind": {"input": "select", "name": "Genre", "options": genres}
      }
    },
  
    "mark": "rect",
    "width": 250,
    "height": 200,
    "encoding": {
      "x": {
        "bin": {"step" : .125},
        "field": "energy",
        "type": "quantitative"
      },
      "y": {
        "field": "year",
        "type": "ordinal",
        "timeUnit": "year",
        "axis" : {"title": null}
      },
      "color": {
        "aggregate": "count",
        "type": "quantitative"
      },
    }
    },
    {
    "transform": [{"filter": { "selection": "genre"}}],
    "selection": {
      "genre": {
        "type": "single",
        "fields": ["broad_genre"],
        "bind": {"input": "select", "name": "Genre", "options": genres}
      }
    },
  
    "mark": "rect",
    "width": 250,
    "height": 200,
    "encoding": {
      "x": {
        "bin": {"step" : 25},
        "field": "tempo",
        "type": "quantitative"
      },
      "y": {
        "field": "year",
        "type": "ordinal",
        "timeUnit": "year",
        "axis" : null
      },
      "color": {
        "aggregate": "count",
        "type": "quantitative"
      },
    }
    },
    {
      "transform": [{"filter": { "selection": "genre"}}],
      "selection": {
        "genre": {
          "type": "single",
          "fields": ["broad_genre"],
          "bind": {"input": "select", "name": "Genre", "options": genres}
        }
      },
    
      "mark": "rect",
      "width": 250,
      "height": 200,
      "encoding": {
        "x": {
          "bin": {"step" : .125},
          "field": "danceability",
          "type": "quantitative"
        },
        "y": {
          "field": "year",
          "type": "ordinal",
          "timeUnit": "year",
          "axis" : null
        },
        "color": {
          "aggregate": "count",
          "type": "quantitative"
        },
      }
      }
  
  ]
    }],
  "config": {
    "range": {
      "heatmap": {
        "scheme": "greenblue"
      }
    },
    "view": {
      "stroke": "transparent"
    }
  }
}






