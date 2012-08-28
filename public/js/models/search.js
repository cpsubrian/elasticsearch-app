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
      facets: [],
      options_facets: []
    },

    submit: function(){
        socket.emit('search', this.toJSON());
    }

  });

  return Search;
});