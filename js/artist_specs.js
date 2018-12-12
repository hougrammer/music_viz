var artistTrackAggregateSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
    "data": { "name": "music-billboard-data" },

    "hconcat": [
      {
        "width" : 350, "height" : 200,
        "selection": {
          "artists": {
            "type": "single",
            "fields": ["artist"],
            "bind": {"input": "select", "name": "Artist", "options": artists}
          }
      },

        "transform": [
          // {"filter": { "field": "artist", "equal" : "drake"}},
          {"filter": { "selection": "artists"}},
          {"sample": 30},
        ],
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
              }
            },
            "selection": {"click": {"encodings": ["y"], "type": "multi"}}
        },
        {
          "width" : 350, "height" : 200,
          "transform": [
            {"filter": { "field": "artist", "equal" : "drake"}},
            {"sample": 30},
            {"filter": {"selection": "click"}}
          ],
          "mark": "circle",
          "encoding": {
            "y": {
              "field": "peak_pos",
              "type": "ordinal",
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
  