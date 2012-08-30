define(function(require) {
  'use strict';
  var View = require('base/view'),
    Chaplin = require('chaplin'),
    FacetsView = require('views/facets_view'),
    Search = require('models/search'),
    template = require('text!templates/search.hbs'),
    socket = require('lib/socket'),
    $ = require('jquery');

  var SearchView = View.extend({

    template: template,
    id: 'search-options',
    container: '#left-column',
    autoRender: true,

    initialize: function(options){
      SearchView.__super__.initialize.apply(this, arguments);
      var self = this;
      self.model = new Search();
      self.subview('facets', new FacetsView());
      self.submitSearch();
    },


    afterRender: function(){
      SearchView.__super__.afterRender.apply(this, arguments);

      this.delegate('submit', 'form', this.onSubmit);
      this.delegate('click', '.filter-select', this.onSelectFilter);
      this.delegate('click', '.sorter-select', this.onSelectSorter);

      this.setup();
    },

    setup: function(){
      var self = this;
      Chaplin.mediator.subscribe('facets-selected', function(facets_selected){
        self.model.set({facets: facets_selected, fromIndex: 0}, {silent: true});
        self.submitSearch();
      });
      Chaplin.mediator.subscribe('page', function(options){
        var desiredIndex = (options.page-1) * options.resultsPerPage;
        self.model.set({fromIndex: desiredIndex, resultsPerPage: options.resultsPerPage});
      });

      self.modelBind('change:text change:filter ' +
        'change:sorter change:fromIndex change:resultsPerPage', self.submitSearch);

    },

    submitSearch: function(){
      socket.emit('search', this.model.toJSON());
    },

    onSubmit: function(e){
      this.model.set({text: e.target.elements[0].value, fromIndex: 0});
      e.preventDefault();
    },

    onSelectFilter: function(e){
      //Show/hide relevant search options
      if(e.target.value === 'people'){
        $('#sorter-list-article').css('display', 'none');
        $('#sorter-list-person').css('display', 'block');
      }else if (e.target.value === 'articles'){
        $('#sorter-list-article').css('display', 'block');
        $('#sorter-list-person').css('display', 'none');
      }else {
        $('#sorter-list-article').css('display', 'none');
        $('#sorter-list-person').css('display', 'none');
      }

      this.model.set({filter: e.target.value, fromIndex: 0});
    },

    onSelectSorter: function(e){
      this.model.set({sorter: e.target.value, fromIndex: 0});
    }
  });

  return SearchView;
});
