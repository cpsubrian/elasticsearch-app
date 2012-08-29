define(function(require) {
  'use strict';
  var Model = require('base/model');

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