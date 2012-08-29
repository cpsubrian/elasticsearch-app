define(function(require) {
  'use strict';
  var View = require('base/view'),
    Chaplin = require('chaplin'),
    Handlebars = require('handlebars'),
    Facets = require('models/facets'),
    template = require('text!templates/facets.hbs'),
    $ = require('jquery'),
    _ = require('underscore');

  var FacetsView = View.extend({

    // Save the template string in a prototype property.
    // This is overwritten with the compiled template function.
    // In the end you might want to used precompiled templates.
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
        if(data.facets){

          //Preserve selection
          //This can probably be done a better way
          var selection = self.model.get('selected');
          for(var i in data.facets){
            for(var name in selection){
              if(data.facets[i].name === name){
                for(var j in selection[name]){
                  for(var k in data.facets[i].values){
                    if (data.facets[i].values[k].term === selection[name][j]){
                      data.facets[i].values[k].selected = true;
                    }
                  }
                }
              }
            }
          }

          //Set new data
          self.model.set('options', data.facets);
        }
      });
    },

    render: function(){
      FacetsView.__super__.render.apply(this, arguments);

      var renderTemp = Handlebars.compile(template);
      var self = this;
      $(self.el).html(renderTemp(self.model.toJSON()));
    },

    onSelectFacet: function(e){
      e.stopImmediatePropagation();

      //Get IDs of selected (facet, value) pair
      var facetIdx = e.target.form.id;
      var selectedIndex = e.target.value;
      //Lookup string values
      var options = this.model.get('options');
      var facetName = options[facetIdx].name;
      var facetVal = options[facetIdx].values[selectedIndex].term;

      //See if this is a select or deselect
      var selectedFacets = this.model.get('selected');
      if(selectedFacets[facetName] && _.indexOf(selectedFacets[facetName], facetVal) != -1){
        //Remove from existing selected list
        selectedFacets[facetName] = _.without(selectedFacets[facetName], facetVal);
        if(selectedFacets[facetName].length == 0){
          delete selectedFacets[facetName];
        }
      }else if(selectedFacets[facetName]){
        //Add to existing selected list
        selectedFacets[facetName].push(facetVal);
      }else{
        //Create new selected list for this facet, containing the selected value
        selectedFacets[facetName] = [facetVal];
      }

      //Submit changes
      this.model.set('selected', selectedFacets);
      Chaplin.mediator.publish('facets-selected', selectedFacets);
    }
  });

  return FacetsView;
});
