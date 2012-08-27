define([
  'base/view',
  'chaplin',
  'models/search',
  'text!templates/search.hbs',
  'lib/socket',
  'jquery'
], function(View, Chaplin, Search, template, socket, $) {
  'use strict';

  var SearchView = View.extend({

    // Save the template string in a prototype property.
    // This is overwritten with the compiled template function.
    // In the end you might want to used precompiled templates.
    template: template,

    className: 'search',

    // Automatically append to the DOM on render
    container: '#page-container',
    // Automatically render after initialize
    autoRender: true,

    $: $,

    afterRender: function(){
      SearchView.__super__.afterRender.apply(this, arguments);

      this.delegate('submit', 'form', this.onSubmit);
      this.delegate('click', '.filter-select', this.onSelectFilter);
      this.delegate('click', '.sorter-select', this.onSelectSorter);

      this.setup();
    },

    setup : function(){
      this.search = new Search({
        text: this.$('#search-text').value,
        filter: this.$('.filter-select[checked="checked"]'),
        sorter: this.$('.sorter-select[checked="checked"]')
      });

   //   socket.every('facets', this.renderFacets);

      var self = this;
      this.search.on('change', function(){
        socket.emit('search', self.search.toJSON());
      });
    },

    onSubmit: function(e){
      this.search.set('text', e.target.elements[0].value);
      e.preventDefault();
    },

    onSelectFilter: function(e){
      this.search.set('filter', e.target.value);
    },

    onSelectSorter: function(e){
      this.search.set('sorter', e.target.value);
    }/*,

    renderFacets: function(data){
      var rendered = template(data);
      this.innerHTML = rendered;
    }*/
  });

  return SearchView;
});
