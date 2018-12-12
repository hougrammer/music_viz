var genreBoxAllYearSpec = 
{
  "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
  "description": "A vertical 2D box plot showing median, min, and max in the US population distribution of age groups in 2000.",
  "data": { "name": "music-billboard-data" },
  "hconcat": [{
      "width" : 350, "height" : 200,
      "mark": {
        "type": "boxplot",
        "extent": "min-max"
      },
      "encoding": {
        "x": {"field": "broad_genre","type": "nominal"},
        "y": {
          "field": "peak_pos",
          "type": "quantitative",
          "axis": {"title": "peak"}
        },
        "color": {
            "field": "broad_genre",
            "type": "nominal",
            "scale": {"scheme": "category20b"}
          }                    

      }
    },
    {
      "width" : 350, "height" : 200,
      "mark": {
        "type": "boxplot",
        "extent": "min-max"
      },
      "encoding": {
        "x": {"field": "broad_genre","type": "nominal"},
        "y": {
          "field": "rank",
          "type": "quantitative",
          "axis": {"title": "rank"}
        },
        "color": {
            "field": "broad_genre",
            "type": "nominal",
            "scale": {"scheme": "category20b"}
          }                    
    }
    }]
}

var genreLinePerYearSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
    "data": { "name": "music-billboard-data" },
    "repeat": {
      "column": [
        "peak_pos",
        "rank",
        "weeks"
      ]
    },
    "spec" : {
      "selection": {
        "genre": {
          "type": "single",
          "fields": ["broad_genre"],
          "bind": {"input": "select", "name": "Genre", "options": genres}
        }
    },
    "transform": [{"filter": { "selection": "genre"}}, {"filter": { "field": "broad_genre", "oneOf" : genres }} ],
    "width" : 200, "height" : 200,
    "mark": "line",
    "encoding": 
    {
        "x": {
            "timeUnit": "year", "field": "year", "type": "temporal"
            },
          "y": {
            "field": {
              "repeat": "column"
            },
            "scale": {"domain": [0,100]},
            "aggregate": "average",
            "type": "quantitative"
          },
          "color": {
            "field": "broad_genre",
            "type": "nominal",
            "scale": {"scheme": "category20b"}
          }                    
    
    }
  }};




var totalGenreWeeksAreaSpec = {
    
    "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
    "data": { "name": "music-billboard-data" },
    "hconcat": [{
        "width" : 350, "height" : 200,
        "mark": "area",
        "transform": [{"filter": { "field": "broad_genre", "oneOf" : genres }}],
        "encoding": 
            {
                "x": {
                    "timeUnit": "year", "field": "year", "type": "temporal"
                    },
                    "y": {
                    "field" : "spotify_id",
                    "aggregate": "distinct",
                    "type": "quantitative"
                    },
                    "color": {
                    "field": "broad_genre",
                    "type": "nominal",
                    "scale": {"scheme": "category20b"}
                    }                    
            }
        },
        {
        "width" : 350, "height" : 200,
        "mark": "area",
        "transform": [{"filter": { "field": "broad_genre", "oneOf" : genres }}],
            "encoding": 
            {
                "x": {
                    "timeUnit": "year", "field": "year", "type": "temporal"
                    },
                    "y": {
                    "field" : "weeks",
                    "aggregate": "sum",
                    "type": "quantitative"
                    },
                    "color": {
                    "field": "broad_genre",
                    "type": "nominal",
                    "scale": {"scheme": "category20b"}
                    }                    
            }
        }
    ]
};


var genreBulletChartSpec =
{
  "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
  "description": "A simple bar chart with embedded data.",
  "data": {
    "values": [
      {"title":"Rap","subtitle":"Rap","ranges":[20,25,100],"measures":[53,76],"markers":[47,75]},
      {"title":"R&B","subtitle":"r&B","ranges":[20,25,100],"measures":[41,74],"markers":[47,75]},
      {"title":"Pop","subtitle":"Pop","ranges":[20,25,100],"measures":[45,71],"markers":[47,75]},
      {"title":"Country","subtitle":"Country","ranges":[20,25,100],"measures":[50,82],"markers":[47,75]},
      {"title":"EDM","subtitle":"EDM","ranges":[20,25,100],"measures":[45,75],"markers":[47,75]},
      {"title":"Rock","subtitle":"Rock","ranges":[20,25,100],"measures":[49,74],"markers":[47,75]}
    ]
  },
  "facet": {
      "row": {
      "field": "title", "type": "ordinal",
      "header": {"labelAngle": 0, "title": ""}
    }
  },
  "spec": {
    "width" : 500, "height" : 30,
    "layer": [{
      "mark": {"type": "bar", "color": "#eee", "size": 30},
      "encoding": {
        "x": {
          "field": "ranges[2]", "type": "quantitative", "scale": {"nice": false},
          "title": null
        }
      }
    },{
      "mark": {"type": "bar", "color": "#c6ecc6", "size": 30},
      "encoding": {
        "x": {"field": "ranges[1]", "type": "quantitative"}
      }
    },{
      "mark": {"type": "bar", "color": "#c6ecc6", "size": 30},
      "encoding": {
        "x": {"field": "ranges[0]", "type": "quantitative"}
      }
    },{
      "mark": {"type": "bar", "color": "#d9d9d9", "size": 10},
      "encoding": {
        "x": {"field": "measures[1]", "type": "quantitative"}
      }
    },{
      "mark": {"type": "bar", "color": "#a6a6a6", "size": 10},
      "encoding": {
        "x": {"field": "measures[0]", "type": "quantitative"}
      }
    },
    {
      "mark": {"type": "tick", "color": "black"},
      "encoding": {
        "x": {"field": "markers[0]", "type": "quantitative"}
      }
    },
    {
      "mark": {"type": "tick", "color": "black"},
      "encoding": {
        "x": {"field": "markers[1]", "type": "quantitative"}
      }
    }

    ]
  },
  "resolve": {
    "scale": {
      "x": "independent"
    }
  },
  "config": {
    "tick": {"thickness": 2}
  }
}


var genreWeeksBubbleSpec = 
{
  "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
  "data": { "name": "music-billboard-data" },
  "transform": [{"filter": { "field": "broad_genre", "oneOf" : genres }}],
  "width": 600,
  "height": 400,
  "mark": {
    "type": "circle",
    "opacity": 0.8,
    "stroke": "black",
    "strokeWidth": 1
  },
  "encoding": {
    "x": {
      "field": "year",
      "type": "ordinal",
      "axis": {"labelAngle": 0}
    },
    "y": {"field": "broad_genre", "type": "nominal", "axis": {"title": ""}},
    "size": {
      "aggregate": "distinct",
      "field": "spotify_id",
      "type": "quantitative",
      "legend": {"title": "Songs Per Genre", "clipHeight": 60},
      "scale": {"range": [0, 4000]}
    },
    "color": {"field": "broad_genre", "type": "nominal", "scale": {"scheme": "category20b"}, "legend": null}
  }
};

//    "selection": {
//      "peakposition": {
//        "type": "single",
//        "fields": ["peakpos"],
//        "bind": {
//          "peakpos": {"input": "range","min": 1,"max": 99,"step": 1, "name": "Peak Position"}
//        }
//      }
//    },



