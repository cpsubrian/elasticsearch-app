define([
  'base/model',
  'lib/socket'
], function(Model) {
  'use strict';

  var Facets = Model.extend({
    defaults: {
      options: null,
      selected: {}
    }

  });

  return Facets;
});