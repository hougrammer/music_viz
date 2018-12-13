// TODO: Issue with default filter - https://github.com/vega/vega-lite/issues/3409

var artistTrackAggregateSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
    "data": { "name": "music-billboard-data" },
    "vconcat": [
      {
        "title" : "Artist songs sorted by weeks on the charts",
        "bounds" : "full",
        "width" : 700, "height" : 300,
            "mark": "bar",
            "encoding": {
                "y": {
                "field": "title", 
                "type": "nominal",
                "sort": {"field" : "weeks", "op": "sum", "order": "descending"},
                "axis": {"title": null, "minExtent": 50, "maxExtent": 100},
              },
              "x": {
                "field": "weeks", 
                "type": "quantitative",
                "scale": {"domain": [0,60]},
                "axis": {"title": null, "minExtent": 70},
              },
              "color": {
                "condition": {
                  "selection": "click",
                  "value": "#2C3E50"
                },
                "value": "#18BC9C"
              }
            },
            "selection": {"click": {"encodings": ["y"], "type": "multi", "empty": "all"}},
            "transform": [
              {"filter": { "field": "artist", "oneOf" : artists }},
              {"filter": { "selection": "artists"}},
              {"sample": 20},
            ]
        },
        {          
          "hconcat": [
          {
            "title" : "Musical attributes sized by weeks on chart.",
            "width" : 250, "height" : 200,
            "transform": [
              {"filter": { "field": "artist", "oneOf" : artists }},
              {"filter": { "selection": "artists"}},
              {"filter": {"selection": "click"}}
            ],
            "mark": "circle",
            "encoding": {
              "color": {"value": "#2C3E50"},
              "y": {
                "field": "peak_pos",
                "sort" : "descending",
                "axis": {"title": "Peak Position"},
                "type": "quantitative",
                "scale": {"domain": [0,100]}
              },
              "x": {
                "bin": {"step" : .25},
                "field": "energy",
                "type": "quantitative",
                "axis": {"title": "Energy", "minExtent": 20},
              },
              "size": {
                "field": "weeks",
                "type": "quantitative",
                "aggregate": "sum"
              }
            },
          },
          {
            "width" : 250, "height" : 200,
            "transform": [
              {"filter": { "field": "artist", "oneOf" : artists }},
              {"filter": { "selection": "artists"}},
              {"filter": {"selection": "click"}}
            ],
            "mark": "circle",
            "encoding": {
              "color": {"value": "#2C3E50"},
              "y": {
                "field": "peak_pos",
                "sort" : "descending",
                "axis": {"title": null},
                "type": "quantitative",
                "scale": {"domain": [0,100]}
              },
              "x": {
                "bin": {"step" : 25},
                "field": "tempo",
                "axis": {"title": "Tempo", "minExtent": 20},
                "type": "quantitative",
              },
              "size": {
                "field": "weeks",
                "type": "quantitative",
                "aggregate": "sum"
              }
            },
          },  
          {
          "width" : 250, "height" : 200,
          "transform": [
            {"filter": { "field": "artist", "oneOf" : artists }},
            {"filter": { "selection": "artists"}},
            {"filter": {"selection": "click"}}
          ],
          "mark": "circle",
          "encoding": {
            "color": {"value": "#2C3E50"},
            "y": {
              "field": "peak_pos",
              "sort" : "descending",
              "type": "quantitative",
              "axis": {"title": null},
              "scale": {"domain": [0,100]}
            },
            "x": {
              "bin": {"step" : .25},
              "field": "danceability",
              "axis": {"title": "Danceability", "minExtent": 20},
              "type": "quantitative",
            },
            "size": {
              "field": "weeks",
              "type": "quantitative",
              "aggregate": "sum"
            }
          },
          "selection": {
            "artists": {
              "type": "single",
              "fields": ["artist"],
              "bind": {"input": "select", "name": "Artists", "options": artists}
            }
          }

        }
      ]
    },
    {          
      "hconcat": [
      {
        "width" : 250, "height" : 200,
        "transform": [
          {"filter": { "field": "artist", "oneOf" : artists }},
          {"filter": { "selection": "artists"}},
          {"filter": {"selection": "click"}}
        ],
        "mark": "circle",
        "encoding": {
          "color": {"value": "#2C3E50"},
          "y": {
            "field": "peak_pos",
            "sort" : "descending",
            "type": "quantitative",
            "axis": {"title": "Peak Position"},
            "scale": {"domain": [0,100]}
          },
          "x": {
            "bin": {"step" : .25},
            "field": "liveness",
            "type": "quantitative",
            "axis": {"title": "Liveness", "minExtent": 20}
          },
          "size": {
            "field": "weeks",
            "type": "quantitative",
            "aggregate": "sum"
          }
        },
      },
      {
        "width" : 250, "height" : 200,
        "transform": [
          {"filter": { "field": "artist", "oneOf" : artists }},
          {"filter": { "selection": "artists"}},
          {"filter": {"selection": "click"}}
        ],
        "mark": "circle",
        "encoding": {
          "color": {"value": "#2C3E50"},
          "y": {
            "field": "peak_pos",
            "sort" : "descending",
            "type": "quantitative",
            "axis": {"title": null},
            "scale": {"domain": [0,100]}
          },
          "x": {
            "field": "key",
            "type": "quantitative",
            "axis": {"title": "Key", "minExtent": 20}
          },
          "size": {
            "field": "weeks",
            "type": "quantitative",
            "aggregate": "sum"
          }
        },
      },  
      {
      "width" : 250, "height" : 200,
      "transform": [
        {"filter": { "field": "artist", "oneOf" : artists }},
        {"filter": { "selection": "artists"}},
        {"filter": {"selection": "click"}}
      ],
      "mark": "circle",
      "encoding": {
        "color": {"value": "#2C3E50"},
        "y": {
          "field": "peak_pos",
          "sort" : "descending",
          "type": "quantitative",
          "axis": {"title": null},
          "scale": {"domain": [0,100]}
        },
        "x": {
          "bin": {"step" : .125},
          "field": "valence",
          "axis": {"title": "Valence", "minExtent": 20},
          "type": "quantitative",
        },
        "size": {
          "field": "weeks",
          "type": "quantitative",
          "aggregate": "sum"
        }
      },
      "selection": {
        "artists": {
          "type": "single",
          "fields": ["artist"],
          "bind": {"input": "select", "name": "Artists", "options": artists}
        }
      }

    }
  ]
  }
]
}
  