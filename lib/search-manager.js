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
  var obj = self.organizeSearchOptions(options);
  console.log(JSON.stringify(obj));

  //Set options for the result page we are retrieving
  var params = {
    fields: '_source',
    from: options.fromIndex,
    size: options.resultsPerPage
  };

  this.app.elasticsearch.search(options.filter, obj, params)
    .on('data', function(results){
      var resultList = [];
      var total = 0;
      var organizedFacets = {};

      if(results.hits){
        //Reorganize results if we have them
        total = results.hits.total;
        for(var i in results.hits.hits){
          var result = results.hits.hits[i]._source;
          result.type = results.hits.hits[i]._type;
          resultList.push(result);
        }
      }

      if (results.facets){
        //Reorganize facets if we have them
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
      }
      var data = {results: resultList, total: total, facets: organizedFacets};
      callback(null, data);
  })
  .on('error', function(err){
    callback(err, null);
  })
  .exec();

};

SearchManager.prototype.organizeSearchOptions = function(options){
  var queryBuilder = this.app.elasticsearch.queryBuilder();

  queryBuilder.addText(options.text);

  //Only execute a sort if the default isn't specified
  if(options.sorter && options.sorter != 'relevance'){
    queryBuilder.addSort(options.sorter);
  }

  //Return relevance facets
  if(options.filter === 'people'){
    //Add interesting facets based on type
    queryBuilder.addTermFacet('regions');
    queryBuilder.addTermFacet('issues');
  }else if (options.filter === 'articles'){
    queryBuilder.addTermFacet('tags');
    queryBuilder.addTermFacet('sections');
  }

  //If 'all', just send back null type
  if(options.filter === 'all')
    options.filter = null;

  //If facets are selected, execute a filter op
  if(options.facets && Object.keys(options.facets).length > 0){
   queryBuilder.addFilters(options.facets);
  }
  return queryBuilder.getObject();

};

