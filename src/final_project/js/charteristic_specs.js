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
  },
  {
    "mark": "circle",
    "encoding": {
      "y": {
        "field": "year",
        "type": "ordinal",
        "timeUnit": "year"
      },
      "x": {
        "bin": {"step" : 0.025},
        "field": "liveness",
        "type": "quantitative"
      },
      "size": {
        "field": "weeks",
        "type": "quantitative",
        "aggregate": "sum"
      }
    }
  }]
}


