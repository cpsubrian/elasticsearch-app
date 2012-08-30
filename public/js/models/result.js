define(function(require) {
  'use strict';
  var Model = require('base/model');

  var Result = Model.extend({
    defaults: {
      name: 'default-result'
    }
  });

  return Result;
});