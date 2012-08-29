define(function(require) {
  'use strict';
  var Chaplin = require('chaplin');

  var Layout = Chaplin.Layout.extend({

    initialize: function(){
      Chaplin.Layout.prototype.initialize.apply(this, arguments);
      //this.subscribeEvent('startupController', this.doSomething);
    }

    //, doSomething: function() {
      // So something cool here.
    //}
  });

  return Layout;
});
