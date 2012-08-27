/**
 * Search App
 */

var cantina = require('cantina');

// Create and export the app.
var app = module.exports = cantina.createApp({
  // app options here ...
  amino: false
});

// Attach plugins
app.use('static');
app.use('socketio', {silent: true});
app.use('elasticsearch', {
  server: {
  //  host: 'ec2-184-73-67-132.compute-1.amazonaws.com',
    host: 'localhost',
    port : 9200
  },
  indexName : 'search-prototype'
});

app.on('io:connected', function(socket){
  socket.on('search', function(dataStr){
    var data = JSON.parse(dataStr);
    search(data, function(err, results){
        if(err) throw err;
        else {
          var data = [];
          if(results.hits){
            for(var i in results.hits.hits){
              data.push(results.hits.hits[i]._source);
            }
          }else {
            console.log(results);
          }
          socket.emit('results', data);
        }
    });
  });
});

var search = function(options, callback){
  console.log(options.text);
  var obj = app.elasticsearch.buildSearchObject(options.text);
  if(options.sort && options.sort != 'relevance'){
    obj = app.elasticsearch.addSort(options.sort, obj);
  }if(options.filter === 'all')
    options.filter = null;
  console.log(obj);
  app.elasticsearch.search(obj, options.filter, callback);

};