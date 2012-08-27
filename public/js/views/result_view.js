define([
  'base/view',
  'chaplin',
  'models/result'
], function(View, Chaplin) {
  'use strict';

  var ResultView = View.extend({

    // Save the template string in a prototype property.
    // This is overwritten with the compiled template function.
    // In the end you might want to used precompiled templates.
    tagName: 'li',
    className: 'result',

    autoRender: true

  });
  return ResultView;
});