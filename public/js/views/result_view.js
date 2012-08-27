define([
  'base/view',
  'chaplin',
  'models/result',
  'text!templates/result.hbs'
], function(View, Chaplin, Result, template) {
  'use strict';

  var ResultView = View.extend({

    // Save the template string in a prototype property.
    // This is overwritten with the compiled template function.
    // In the end you might want to used precompiled templates.
    template: template,
    tagName: 'li',
    className: 'result',

    initialize: function(options){
      ResultView.__super__.initialize.apply(this, arguments);
    }

  });
  return ResultView;
});