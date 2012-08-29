define(function(require) {
  'use strict';
  var Model = require('base/model');

  var Result = Model.extend({
    name: 'default-result',

    constructor: function(attrs){
      Result.__super__.constructor.apply(this, arguments);
    }
  });

  return Result;
});