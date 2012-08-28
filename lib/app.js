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
  app.socket = socket;
  app.socket.on('search', runQuery);
});

var runQuery = function(data){
  search(data, function(err, results){
    if(err) throw err;
    else {
      var resultList = [];
      if(results.hits){
        for(var i in results.hits.hits){
          resultList.push(results.hits.hits[i]._source);
        }
      }else {
        console.log(results);
      }

      var facetCounts = [];
      for(var field in results.facets){
        var values = results.facets[field].terms;
        values.sort(function(a, b){ return b.count-a.count;});
        facetCounts.push({name: field, values : values})
      }
      var data = {results: resultList, facets: facetCounts};
      app.socket.emit('results', data);
    }
  });
};

var search = function(options, callback){
  console.log(options);
  var obj = app.elasticsearch.buildSearchObject(options.text);
  if(options.sort && options.sort != 'relevance'){
    obj = app.elasticsearch.addSort(options.sort, obj);
  }
  if(options.filter === 'people'){
    //Add interesting facets based on type
    app.elasticsearch.addTermFacet('regions', obj);
    app.elasticsearch.addTermFacet('issues', obj);
  }
  if(options.filter === 'all')
    options.filter = null;
  app.elasticsearch.search(obj, options.filter, callback);

};

