const ugs = require('ultimate-guitar-scraper')
const fs = require('fs')
const fileContents = fs.readFileSync('./song_list.json', 'utf8')

var data 
try {
  data = JSON.parse(fileContents)

} catch(err) {
  console.error(err)
}

for (i=0; i<80; i++) {
    let tabUrl = data[i]["URL"]
    let genre = data[i]["Genre"]
    let song = data[i]["Song"]
    let key = data[i]["Key"] 
    ugs.get(tabUrl, (error, tab) => {
	    if (error) {
		console.log(error)
	    } else {
            var re = /(\[ch\])[\w\d]+(\[\/ch\])/g;
            var str = tab["content"]["text"];
            var myArray = str.match(re);
            for (j=0; j<myArray.length; j++) {
                var re2 = /(\[ch\])|(\[\/ch\])/g;
                chordRaw = "'" + myArray[j] + "'";
                var chord = chordRaw.replace(re2, "");
                myArray[j] = chord
                /*console.log(song+","+genre+","+j+","+chord)*/
            }
        console.log(song+";"+genre+";"+key+";"+"["+myArray+"]")
	    }
	})
}

 

