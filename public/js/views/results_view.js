define(function(require) {
  'use strict';
  var CollectionView = require('base/collection_view'),
    Chaplin = require('chaplin'),
    ResultView = require('views/result_view'),
    template = require('text!templates/results.hbs'),
    socket = require('lib/socket'),
    $ = require('jquery');

  var ResultsView = CollectionView.extend({

    template: template,
    id:"result-list",
    container: '#right-column',
    listSelector: '#results',

    resultsPerPage: 10,
    page: 1,
    from: 0,
    to: 0,

    afterRender: function(){
      ResultsView.__super__.afterRender.apply(this, arguments);

      this.delegate('click', '.page', this.onPageClick);
      this.setup();
    },

    setup: function(){

      var self = this;
      socket.on('results', function(data){
        self.page = data.page;

        //Publish results for anyone else to see
        Chaplin.mediator.publish('results', data);

        //Set mediator properties for template
        Chaplin.mediator.numPages = Math.ceil(data.total/self.resultsPerPage);
        Chaplin.mediator.currentPage = data.page;
        self.render();

        //Write pagination
        if(data.total > 0){
          self.from = (self.page - 1) * self.resultsPerPage + 1;
          self.to = self.from + data.results.length - 1;
          $('#result-count').html('Showing ' + self.from + '-' + self.to + ' of ' + data.total);
        }else {
          $('#result-count').html('No results found matching query');
        }

        //Set our own data
        self.collection.reset(data.results);

        //HACK: For some reason without this call it does not render first model
        self.renderAllItems();

      });
    },

    getView: function(model){
      return new ResultView({model: model});
    },

    onPageClick: function(e){
      e.preventDefault();
      this.page = e.target.innerHTML;
      Chaplin.mediator.publish('page', {page: this.page, resultsPerPage: this.resultsPerPage});
    }

  });
  return ResultsView;
});
