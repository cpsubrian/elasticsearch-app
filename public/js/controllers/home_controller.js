define([
  'base/controller',
  'views/home_view'
], function(Controller, HomeView) {
  'use strict';

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