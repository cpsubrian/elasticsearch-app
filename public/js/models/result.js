define(function(require) {
  'use strict';
  var Model = require('base/model');

  var Result = Model.extend({
    defaults: {
      name: 'default-result'
    },
    validate: function(attrs){
      if(!attrs.type)
        return "Result must define its type";

      if(attrs.type === 'people'){
        if(!attrs.name || !attrs.tag_line || !attrs.connections
          || !attrs.regions || !attrs.issues)
          return "Person missing required attribute(s)";
      }else if (attrs.type === 'articles'){
        if(!attrs.title || !attrs.text || !attrs.date || !attrs.sections
          || !attrs.tags || !attrs.url);
          return "Article missing required attribute(s)";
      }
    }
  });

  return Result;
});