define(function(require) {
  'use strict';

  var Handlebars = require('handlebars'),
    Chaplin = require('chaplin'),
    utils = require('lib/utils');

  // View helpers (Handlebars in this case)
  // --------------------------------------
  var mediator = Chaplin.mediator;
  Handlebars.registerHelper('pages', function(){
    var pages = mediator.numPages;
    if(pages > 1){
      var ul = "<ul>";
      for(var i=1; i<pages+1; i++){
        var li;
        if(i === mediator.currentPage){
          li = '<li style="display: inline"><a class="page">' + i + '</a></li>&nbsp;&nbsp;&nbsp;';
        }else {
          li = '<li style="display: inline"><a href="" class="page">' + i + '</a></li>&nbsp;&nbsp;&nbsp;';
        }
        ul = ul.concat(li);
      }
      ul = ul.concat("</ul>");
      return new Handlebars.SafeString(ul);
    }else return '';
  });
});