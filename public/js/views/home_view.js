define([
  'chaplin',
  'base/view',
  'views/search_view',
  'views/results_view',
  'models/result_collection'
], function(Chaplin, View, SearchView, ResultsView, ResultCollection) {
  'use strict';

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