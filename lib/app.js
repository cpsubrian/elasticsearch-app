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
app.use('socketio');
app.use('elasticsearch', {
  server: {
  //  host: 'ec2-184-73-67-132.compute-1.amazonaws.com',
    host: 'localhost',
    port : 9200
  },
  indexName : 'search-prototype'
});

app.on('io:connected', function(socket){
  socket.on('search', function(data){
    search(data, function(err, results){
        if(err) throw err;
        else
          socket.emit('results', results.hits.hits);
    });
  });
});

var search = function(options, callback){
  var obj = app.elasticsearch.buildSearchObject(options.text);
  if(options.sort != 'relevance'){
    obj = app.elasticsearch.addSort(options.sort, obj);
  }if(options.filter === 'all')
    options.filter = null;
  app.elasticsearch.search(obj, options.filter, callback);

};