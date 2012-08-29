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
    container: '#page-container',
    listSelector: 'ol',
    list: '#results',
    resultsPerPage: 10,


    from: 0,
    to: 0,

    initialize: function(options){
      ResultsView.__super__.initialize.apply(this, arguments);
    },

    afterRender: function(){
      ResultsView.__super__.afterRender.apply(this, arguments);

      this.delegate('click', '.page', this.onPageClick);
      this.setup();
    },

    setup: function(){

      var self = this;
      socket.on('results', function(data){

        //Publish results for anyone else to see
        Chaplin.mediator.publish('results', data);

        //Set mediator properties for template
        Chaplin.mediator.numPages = Math.ceil(data.total/self.resultsPerPage);
        Chaplin.mediator.currentPage = data.page;
        self.render();

        //Set our own data and render the page
        self.collection.reset(data.results);


        //Write pagination
        self.from = (data.page - 1) * self.resultsPerPage + 1;
        self.to = self.from + data.results.length - 1;
        $('#result-count').html('Showing ' + self.from + '-' + self.to + ' of ' + data.total);
        $("#pagination").css("display", "block");
        $('ol').attr('start', self.from);

      });
    },

    getView: function(model){
      return new ResultView({model: model});
    },

    onPageClick: function(e){
      e.preventDefault();
      var page = e.target.innerHTML;
      Chaplin.mediator.publish('page', {page: page, resultsPerPage: this.resultsPerPage});
    }

  });
  return ResultsView;
});
