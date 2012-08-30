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
  console.log(JSON.stringify(obj));

  //Run the search
  this.runSearch(obj, options, callback);

};

SearchManager.prototype.organizeSearchOptions = function(options){

  //TODO: NEED TO WORK ON TEXT MORE
  //previews, fuzzy match params, etc
  var obj = this.app.elasticsearch.buildSearchObject(options.text);

  //Only execute a sort if the default isn't specified
  if(options.sorter && options.sorter != 'relevance'){
    obj = this.app.elasticsearch.addSort(options.sorter, obj);
  }

  //Return relevance facets
  if(options.filter === 'people'){
    //Add interesting facets based on type
    this.app.elasticsearch.addTermFacet('regions', obj);
    this.app.elasticsearch.addTermFacet('issues', obj);
  }else if (options.filter === 'articles'){
    this.app.elasticsearch.addTermFacet('tags', obj);
    this.app.elasticsearch.addTermFacet('sections', obj);
  }

  //If 'all', just send back null type
  if(options.filter === 'all')
    options.filter = null;

  //If facets are selected, execute a filter op
  if(options.facets && Object.keys(options.facets).length > 0){
    var searchObj = {
      query: {
        filtered: {
          query : obj.query,
          filter: {
          }
        }
      }
    };
    var termsFilters = [];
    for(var name in options.facets){
      var termsFilter ={terms: {}};
      termsFilter.terms[name] = options.facets[name];
      if(options.facets[name].length > 1){
        termsFilter.terms.execution = "and";
      }
      termsFilters.push(termsFilter);
    }
    if(termsFilters.length > 1){
      searchObj.query.filtered.filter.and = termsFilters;
    }else{
      searchObj.query.filtered.filter.terms = termsFilters[0].terms;
    }
    if(obj.facets)
      searchObj.facets = obj.facets;
    obj = searchObj;

  }
  return obj;

};

SearchManager.prototype.runSearch = function(obj, options, callback){
  var params = {
    fields: '_source',
    from: options.fromIndex,
    size: options.resultsPerPage
  };
  console.log(params);
  this.app.elasticsearch.search(obj, options.filter, params, function(err, results){
    if(err) callback(err, null);
    else {
      var resultList = [];
      var total = 0;
      if(results.hits){
        total = results.hits.total;
        for(var i in results.hits.hits){
          var result = results.hits.hits[i]._source;
          result.type = results.hits.hits[i]._type;
          resultList.push(result);
        }
      }else {
        console.log(results);
      }

      var organizedFacets = {};
      for(var field in results.facets){
        organizedFacets[field] = {};
        var termNameAndCounts = results.facets[field].terms;
        termNameAndCounts.sort(function(a,b){return b.count- a.count});
        for(var tIdx in termNameAndCounts){
          organizedFacets[field][termNameAndCounts[tIdx].term] = {
            count : termNameAndCounts[tIdx].count
          };
        }
      }
      console.log(organizedFacets);

      var page = Math.ceil((options.fromIndex) / options.resultsPerPage) + 1;
      page = (page === 0 ? 1 : page);
      var data = {results: resultList, total: total, facets: organizedFacets, page: page};
      callback(null, data);
    }
  });
};
