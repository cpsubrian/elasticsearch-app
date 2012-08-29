define(function(require) {
  'use strict';
  var View = require('base/view'),
    SearchView = require('views/search_view'),
    ResultsView = require('views/results_view'),
    ResultCollection = require('models/result_collection');

	var HomeView = View.extend({
	    el : '#page-container',

		initialize: function(){
      HomeView.__super__.initialize.apply(this, arguments);

			//Render views
			this.subview('search', new SearchView());
      this.subview('results', new ResultsView({collection: new ResultCollection()}));

		}
	});

	return HomeView;
});