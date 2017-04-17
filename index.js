// Vue is something called a front-end framework, basically what it does is let you maintain a data 'model'
// in your javascript and it'll automatically keep the html updated. Basically, the key part here is the
// 'data', which is just a key-value map that's made available to the html. So, for example, if i had
// something like 'name: "Vishnu"' in the data section, then I could do {{name}} in my html and it would
// show up as "Vishnu". Here, the things in our data model are "connections" (anarray of all the rows in the
// spreadsheet), "randomConnection" (a randomly selected connection), "randomTime" (the timeStamp of that connection),
// and "lineData" (data for generating the line graph). The 'el: "#app"' line just defines which HTML element Vue
// should be watching.

var app = new Vue({
  el: '#app',
  data: {
    connections: [],
    randomConnection: "",
    randomTime: "",
    lineData: []
  }
});

// This init() function is called as soon as the page finishes loading

function init() {
  // Tabletop is a library that lets you access Google Sheets data as javascript objects.
  // The 'key' is just the public url of the sheet. the 'callback' is a function that gets called
  // once the data has loaded; the first argument, 'data', is an array in which each element is an object
  // that represents a single row in the Google Sheet
  Tabletop.init({
    key: 'https://docs.google.com/spreadsheets/d/1lwwR32XxNpKw2OzySJ2nLVa_s4IxrYteag_FK9dc-RE/pubhtml',
    callback: function(data, tabletop) {
      // Once we have the data, we're storing the entire thing in 'app.connections', which is the same
      // as the 'connections' that we defined above in Vue. Note that this 'data' and the
      // 'data' defined on line 12 are not at all related. BTW, fun fact, each element in this array
      // is in JSON (in case you're still tryna learn about JSON n shit for IronClad)
       app.connections = data;
      // Picks a random element from the array
       var randomEntry = data[Math.floor(Math.random() * data.length)];
       // a JS object, like randomEntry, is basically just a map of key-value pairs. You access
       // the value associated with a key by using brackets. So, for example, if myObj = {a: 1, b: 6},
       // then myObj['b'] would evaluate to be 6. So, the next two lines just store the message and the
       // timestamp of our randomEntry
       app.randomConnection = randomEntry["Tell us about your connection"];
       app.randomTime = randomEntry["Timestamp"];
       // This part basically converts the array of objects into an array of timestamps,
       // i.e. 'times' is an array such that times[i] is the timestamp on the i-th
       // entry in our data array. Also, the getTime() method converts all the timestamps
       // into Unix Epoch Timestamps, which means that they're just a number of miliseconds
       // since Jan 1, 1970
       var times = data.map((entry) => {
         return new Date(entry["Timestamp"]).getTime();
       });
       // An empty array
       var points = [];
       // At 2-hour increments starting at the earliest timestamp and ending at the latest one,
       // we're going to add an element to the array 'points' that is the number of entries
       // submitted at or before that time.
       for(i = times[0]; i <= times[times.length - 1]; i += 7200000) {
         points.push(times.filter((t) => t < i).length)
       }
       // Store this array in lineData, so that it can be used to generate the trend line.
       app.lineData = points;
    },
    simpleSheet: true
  });
}

// makes sure that init() is called
window.addEventListener('DOMContentLoaded', init)
