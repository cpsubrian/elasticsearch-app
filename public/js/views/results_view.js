define([
  'base/collection_view',
  'chaplin',
  'views/result_view',
  'models/result',
  'models/result_collection',
  'text!templates/results.hbs',
  'lib/socket'
], function(CollectionView, Chaplin, ResultView, Result, ResultCollection, template, socket) {
  'use strict';

  var ResultsView = CollectionView.extend({

    template: template,
    id:"result-list",
    container: '#page-container',
    listSelector: 'ul',

    initialize: function(options){
      ResultsView.__super__.initialize.apply(this, arguments);
    },

    afterRender: function(){
      ResultsView.__super__.afterRender.apply(this, arguments);

      this.setup();
    },

    setup: function(){

      var self = this;
      socket.on('results', function(data){
        self.collection.reset(data);
      });
    },

    getView: function(model){
      return new ResultView({model: model});
    }

  });
  return ResultsView;
});
