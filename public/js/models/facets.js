define(function(require) {
  'use strict';
  var Model = require('base/model');

  var Facets = Model.extend({
    defaults: {
      options: null,
      selected: {}
    }

  });

  return Facets;
});