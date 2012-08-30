define(function(require) {
  'use strict';
  var View = require('base/view'),
    Chaplin = require('chaplin'),
    Facets = require('models/facets'),
    template = require('text!templates/facets.hbs'),
    $ = require('jquery'),
    _ = require('underscore');

  var FacetsView = View.extend({

    template: template,
    id: 'facet-list',
    container: '#search-options',
    autoRender: true,

    initialize: function(options){
      FacetsView.__super__.initialize.apply(this, arguments);
      this.model = new Facets();
      this.modelBind('change:options', this.render);

    },


    afterRender: function(){
      FacetsView.__super__.afterRender.apply(this, arguments);

      this.delegate('click', '.facet-select', this.onSelectFacet);

      this.setup();
    },

    setup : function(){
      var self = this;
      Chaplin.mediator.subscribe('results', function(data){
        if(Object.keys(data.facets).length > 0){

          //Preserve selection
          var selection = self.model.get('selected');
          for(var facet in selection){
            if(data.facets[facet]){
              for(var i in selection[facet]){
                var name = selection[facet][i];
                if(data.facets[facet][name])
                  data.facets[facet][name].selected = true;
              }
            }
          }

          //Set new data
          self.model.set('options', data.facets);
        }
      });
    },

    onSelectFacet: function(e){
      e.stopImmediatePropagation();

      //Get selected (facet, value) pair
      var facetName = e.target.form.id;
      var facetVal = e.target.value;

      var selectedFacets = this.model.get('selected');

      //If this value is in the selected list, this action was a deselect
      if(selectedFacets[facetName] && _.indexOf(selectedFacets[facetName], facetVal) != -1){
        //Remove from existing selected list
        selectedFacets[facetName] = _.without(selectedFacets[facetName], facetVal);
        if(selectedFacets[facetName].length == 0){
          delete selectedFacets[facetName];
        }
      //Otherwise, add it to the list, creating a key entry if necessary
      }else if(selectedFacets[facetName]){
        selectedFacets[facetName].push(facetVal);
      }else{
        selectedFacets[facetName] = [facetVal];
      }

      //Submit changes
      this.model.set('selected', selectedFacets);
      Chaplin.mediator.publish('facets-selected', selectedFacets);
    }
  });

  return FacetsView;
});
