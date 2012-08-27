define([
  'base/collection',
  'models/result'
], function(Collection, Result) {
  'use strict';

  var ResultCollection = Collection.extend({
    name: 'results',
    model: Result
  });

  return ResultCollection;
});