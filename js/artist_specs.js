// TODO: Issue with default filter - https://github.com/vega/vega-lite/issues/3409

var artistTrackAggregateSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
    "data": { "name": "music-billboard-data" },
    "vconcat": [
      {
        "width" : 700, "height" : 300,
            "mark": "bar",
            "encoding": {
                "y": {
                "field": "title", 
                "type": "nominal",
                "sort": {"field" : "weeks", "op": "sum", "order": "descending"}
              },
              "x": {
                "field": "weeks", 
                "type": "quantitative",
                "axis": {"title": "weeks on chart"}
              },
              "color": {
                "condition": {
                  "selection": "click",
                  "value": "red"
                },
                "value": "grey"
              }
            },
            "selection": {"click": {"encodings": ["y"], "type": "multi", "empty": "all"}},
            "transform": [
              {"filter": { "field": "artist", "oneOf" : artists }},
              {"filter": { "selection": "artists"}},
              {"sample": 30},
            ]
        },
        {          
          "hconcat": [
          {
            "width" : 200, "height" : 150,
            "transform": [
              {"filter": { "field": "artist", "oneOf" : artists }},
              {"filter": { "selection": "artists"}},
              {"filter": {"selection": "click"}}
            ],
            "mark": "circle",
            "encoding": {
              "y": {
                "field": "peak_pos",
                "sort" : "descending",
                "type": "quantitative",
                "scale": {"domain": [0,100]}
              },
              "x": {
                "bin": {"step" : .5},
                "field": "energy",
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
            "width" : 200, "height" : 150,
            "transform": [
              {"filter": { "field": "artist", "oneOf" : artists }},
              {"filter": { "selection": "artists"}},
              {"filter": {"selection": "click"}}
            ],
            "mark": "circle",
            "encoding": {
              "y": {
                "field": "peak_pos",
                "sort" : "descending",
                "type": "quantitative",
                "scale": {"domain": [0,100]}
              },
              "x": {
                "bin": {"step" : .5},
                "field": "tempo",
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
          "width" : 200, "height" : 150,
          "transform": [
            {"filter": { "field": "artist", "oneOf" : artists }},
            {"filter": { "selection": "artists"}},
            {"filter": {"selection": "click"}}
          ],
          "mark": "circle",
          "encoding": {
            "y": {
              "field": "peak_pos",
              "sort" : "descending",
              "type": "quantitative",
              "axis": {"title": "Peak Position"},
              "scale": {"domain": [0,100]}
            },
            "x": {
              "bin": {"step" : 5},
              "field": "loudness",
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
        "width" : 200, "height" : 150,
        "transform": [
          {"filter": { "field": "artist", "oneOf" : artists }},
          {"filter": { "selection": "artists"}},
          {"filter": {"selection": "click"}}
        ],
        "mark": "circle",
        "encoding": {
          "y": {
            "field": "peak_pos",
            "sort" : "descending",
            "type": "quantitative",
            "scale": {"domain": [0,100]}
          },
          "x": {
            "bin": {"step" : .5},
            "field": "danceability",
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
        "width" : 200, "height" : 150,
        "transform": [
          {"filter": { "field": "artist", "oneOf" : artists }},
          {"filter": { "selection": "artists"}},
          {"filter": {"selection": "click"}}
        ],
        "mark": "circle",
        "encoding": {
          "y": {
            "field": "peak_pos",
            "sort" : "descending",
            "type": "quantitative",
            "scale": {"domain": [0,100]}
          },
          "x": {
            "bin": {"step" : .5},
            "field": "speechiness",
            "type": "quantitative",
            "axis": {"maxExtent": 5},
          },
          "size": {
            "field": "weeks",
            "type": "quantitative",
            "aggregate": "sum"
          }
        },
      },  
      {
      "width" : 200, "height" : 150,
      "transform": [
        {"filter": { "field": "artist", "oneOf" : artists }},
        {"filter": { "selection": "artists"}},
        {"filter": {"selection": "click"}}
      ],
      "mark": "circle",
      "encoding": {
        "y": {
          "field": "peak_pos",
          "sort" : "descending",
          "type": "quantitative",
          "axis": {"title": "Peak Position"},
          "scale": {"domain": [0,100]}
        },
        "x": {
          "bin": {"step" : 5},
          "field": "instrumentalness",
          "type": "quantitative",
          "axis": {"maxExtent": 5},
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
      "width" : 200, "height" : 150,
      "transform": [
        {"filter": { "field": "artist", "oneOf" : artists }},
        {"filter": { "selection": "artists"}},
        {"filter": {"selection": "click"}}
      ],
      "mark": "circle",
      "encoding": {
        "y": {
          "field": "peak_pos",
          "sort" : "descending",
          "type": "quantitative",
          "scale": {"domain": [0,100]}
        },
        "x": {
          "bin": {"step" : 1},
          "field": "key",
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
      "width" : 200, "height" : 150,
      "transform": [
        {"filter": { "field": "artist", "oneOf" : artists }},
        {"filter": { "selection": "artists"}},
        {"filter": {"selection": "click"}}
      ],
      "mark": "circle",
      "encoding": {
        "y": {
          "field": "peak_pos",
          "sort" : "descending",
          "type": "quantitative",
          "scale": {"domain": [0,100]}
        },
        "x": {
          "bin": {"step" : .5},
          "field": "valence",
          "type": "quantitative",
          "axis": {"maxExtent": 5},
        },
        "size": {
          "field": "weeks",
          "type": "quantitative",
          "aggregate": "sum"
        }
      },
    },  
    {
    "width" : 200, "height" : 150,
    "transform": [
      {"filter": { "field": "artist", "oneOf" : artists }},
      {"filter": { "selection": "artists"}},
      {"filter": {"selection": "click"}}
    ],
    "mark": "circle",
    "encoding": {
      "y": {
        "field": "peak_pos",
        "sort" : "descending",
        "type": "quantitative",
        "axis": {"title": "Peak Position"},
        "scale": {"domain": [0,100]}
      },
      "x": {
        "bin": {"step" : 5},
        "field": "time_signature",
        "type": "quantitative",
        "axis": {"maxExtent": 5},
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
]
}
  