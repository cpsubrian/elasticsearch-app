define(function(require) {
  'use strict';

  var _ = require('underscore'),
    utils = require('lib/utils'),
    Chaplin = require('chaplin');

  // Application-specific feature detection
  // --------------------------------------

  // Delegate to Chaplin’s support module
  var support = utils.beget(Chaplin.support);

  // Add additional application-specific properties and methods

  // _(support).extend({
  //   someProperty: 'foo',
  //   someMethod: function(){}
  // });

  return support;
});
