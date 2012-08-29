define(function(require) {
  'use strict';
  var Collection = require('base/collection'),
    Result = require('models/result');

  var ResultCollection = Collection.extend({
    name: 'results',
    model: Result,
    results: []
  });

  return ResultCollection;
});