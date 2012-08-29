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
    listSelector: 'ul',
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

        //Set our own data
        self.collection.reset(data.results);
        //Publish results for anyone else to see
        Chaplin.mediator.publish('results', data);

        //Write pagination
        //Placeholder: I know this can probably be done a better way
        self.from = (data.page - 1) * self.resultsPerPage + 1;
        self.to = self.from + data.results.length - 1;
        var total = data.total;
        $('#result-count').html('Showing ' + self.from + '-' + self.to + ' of ' + total);
        if(self.from < total){
          var pages = total/self.resultsPerPage;
          var ul = "<ul>";
          for(var i=1; i<pages+1; i++){
            var li;
            if(i === data.page){
              li = '<li style="display: inline"><a class="page">' + i + '</a></li>&nbsp;&nbsp;&nbsp;';
            }else {
              li = '<li style="display: inline"><a href="" class="page">' + i + '</a></li>&nbsp;&nbsp;&nbsp;';
            }
            ul = ul.concat(li);
          }
          ul = ul.concat("</ul>");
          $("#pagination").html(ul);
          $("#pagination").css("display", "block");
        }
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
