define(function(require) {
  'use strict';
  var Controller = require('base/controller'),
    HomeView = require('views/home_view');

	var HomeController = Controller.extend({

    	title: 'Home',

		historyURL : function(params){
			return '';
		},

		index: function(params){
			this.view = new HomeView();
		}
	});

	return HomeController;
});