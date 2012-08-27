define([
  'base/model'
], function(Model) {
  'use strict';

  var Result = Model.extend({
    name: 'default-result',

    constructor: function(attrs){
      Result.__super__.constructor.apply(this, arguments);
    }
  });

  return Result;
});