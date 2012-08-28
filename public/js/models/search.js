define([
  'base/model',
  'lib/socket'
], function(Model, socket) {
  'use strict';

  var Search = Model.extend({
    defaults: {
      name: 'search',
      text : '',
      filter: 'all',
      sorter: 'relevance',
      facets: null
    }

  });

  return Search;
});