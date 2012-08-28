/**
 * Search Manager
 * ------------
 *
 * Handles search requests.
 *
 * @class SearchManager
 * @constructor
 * @param app {Object} A cantina application instance.
 */
var SearchManager = function(app) {
  this.app = app;

  this.setupSockets();
};
module.exports = SearchManager;

SearchManager.prototype.setupSockets = function(){
  var self = this;
  self.app.on('io:connected', function(socket){
    socket.on('search', function(data){
      self.search(data, function(err, results){
        if(err)
          console.log(err);
        else
          socket.emit('results', results);
      });
    });
  });
};

SearchManager.prototype.search = function(options, callback){
  var self = this;
  console.log(options);
  var obj = self.organizeSearchOptions(options);
  console.log(obj);

  //Run the search
  this.runSearch(obj, options.filter, callback);

};

SearchManager.prototype.organizeSearchOptions = function(options){

  var obj = this.app.elasticsearch.buildSearchObject(options.text);

  //Only execute a sort if the default isn't specified
  if(options.sort && options.sort != 'relevance'){
    obj = app.elasticsearch.addSort(options.sort, obj);
  }

  //Return relevance facets
  if(options.filter === 'people'){
    //Add interesting facets based on type
    this.app.elasticsearch.addTermFacet('regions', obj);
    this.app.elasticsearch.addTermFacet('issues', obj);
  }

  //If 'all', just send back null type
  if(options.filter === 'all')
    options.filter = null;

  //If facets are selected, execute a filter op
  if(Object.keys(options.facets).length > 0){
    var searchObj = {
      query: {
        filtered: {
          query : obj.query,
          filter: {
            terms : {}
          }
        }
      }
    };
    for(var name in options.facets){
      searchObj.query.filtered.filter.terms[name] = options.facets[name];
    }
    obj = searchObj;
  }
  return obj;

};

SearchManager.prototype.runSearch = function(obj, type, callback){
  this.app.elasticsearch.search(obj, type, function(err, results){
    if(err) callback(err, null);
    else {
      var resultList = [];
      if(results.hits){
        for(var i in results.hits.hits){
          resultList.push(results.hits.hits[i]._source);
        }
      }else {
        console.log(results);
      }

      var facetCounts = null;

      //Facets won't exist on a filtered search
      if(!obj.query.filtered){
        facetCounts = [];
        var fIdx = 0;
        for(var field in results.facets){
          var values = results.facets[field].terms;
          values.sort(function(a, b){ return b.count-a.count;});
          for (var tIdx in values){
            values[tIdx].idx=tIdx;
          }
          facetCounts.push({name: field, values : values, idx: fIdx});
          fIdx++;
        }
      }

      var data = {results: resultList, facets: facetCounts};
      callback(null, data);
    }
  });
};
