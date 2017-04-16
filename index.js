var app = new Vue({
  el: '#app',
  data: {
    connections: [],
    randomConnection: "",
    randomTime: "",
    lineData: []
  }
});

function init() {
  Tabletop.init({
    key: 'https://docs.google.com/spreadsheets/d/1lwwR32XxNpKw2OzySJ2nLVa_s4IxrYteag_FK9dc-RE/pubhtml',
    callback: function(data, tabletop) {
       app.connections = data;
       var randomEntry = data[Math.floor(Math.random() * data.length)];
       app.randomConnection = randomEntry["Tell us about your connection"];
       app.randomTime = randomEntry["Timestamp"];
       var times = data.map((entry) => {
         return new Date(entry["Timestamp"]).getTime();
       });
       var points = [];
       for(i = times[0]; i <= times[times.length - 1]; i += 7200000) {
         points.push(times.filter((t) => t < i).length)
       }
       app.lineData = points;
    },
    simpleSheet: true
  });
}

window.addEventListener('DOMContentLoaded', init)
