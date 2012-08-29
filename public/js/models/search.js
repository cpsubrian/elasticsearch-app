define([
  'base/model'
], function(Model) {
  'use strict';

  var Search = Model.extend({
    defaults: {
      name: 'search',
      text : '',
      filter: 'all',
      sorter: 'relevance',
      fromIndex: 0,
      resultsPerPage: 10,
      facets: null
    }

  });

  return Search;
});