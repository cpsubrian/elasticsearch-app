define([
  'base/model'
], function(Model) {
  'use strict';

  var Search = Model.extend({
    name: 'search',

    constructor: function(attrs){
      Search.__super__.constructor.apply(this, arguments);
    },

    toJSON: function(){
      var attr = {}
      for (var key in this.attributes){
        if(typeof this.attributes[key] === 'string'){
          attr[key] = this.attributes[key];
        }
      }
      return JSON.stringify(attr);
    }
  });

  return Search;
});