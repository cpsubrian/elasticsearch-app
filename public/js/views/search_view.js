define([
  'base/view',
  'chaplin',
  'handlebars',
  'models/search',
  'text!templates/search.hbs',
  "jquery"
], function(View, Chaplin, Handlebars, Search, template, $) {
  'use strict';

  var SearchView = View.extend({

    // Save the template string in a prototype property.
    // This is overwritten with the compiled template function.
    // In the end you might want to used precompiled templates.
    template: template,
    id: 'search-options',
    container: '#page-container',
    autoRender: true,
    containerMethod: 'prepend',

    initialize: function(options){
      this.model = new Search();
      SearchView.__super__.initialize.apply(this, arguments);
    },


    afterRender: function(){
      SearchView.__super__.afterRender.apply(this, arguments);

      this.delegate('submit', 'form', this.onSubmit);
      this.delegate('click', '.filter-select', this.onSelectFilter);
      this.delegate('click', '.sorter-select', this.onSelectSorter);
      this.delegate('click', '.facet', this.onSelectFacet);

      this.modelBind('change:options_facets change:name', this.render);

      this.setup();
    },

    setup : function(){
      var self = this;
      Chaplin.mediator.subscribe('results', function(data){
        var result = self.model.set('options_facets', data.facets);
        if(!result)
          throw "Error!";
      });
    },

    render : function(){
      var renderTemp = Handlebars.compile(template);
      $(this.el).html(renderTemp(this.model.toJSON()));
    },

    onSubmit: function(e){
      this.model.set('text', e.target.elements[0].value);
      e.preventDefault();
      this.model.submit();
    },

    onSelectFilter: function(e){
      this.model.set('filter', e.target.value);
      this.model.submit();
    },

    onSelectSorter: function(e){
      this.model.set('sorter', e.target.value);
      this.model.submit();
    },

    onSelectFacet: function(e){
      var selectedFacets = this.model.get('facets');
      selectedFacets.push(e.target.value);
      this.model.set('facets', selectedFacets);
      this.model.submit();
    }
  });

  return SearchView;
});
