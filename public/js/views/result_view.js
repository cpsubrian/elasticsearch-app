define(function(require) {
  'use strict';
  var View = require('base/view'),
    template = require('text!templates/result.hbs');

  var ResultView = View.extend({

    template: template,
    tagName: 'li',
    className: 'result',
    container: '#results'

  });
  return ResultView;
});