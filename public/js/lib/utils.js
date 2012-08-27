/**
 * Utility functions and properties.
 */
define(function(require) {
  'use strict';

  // Module dependencies.
  var _ = require('underscore'),
      jquery = require('jquery'),
      Chaplin = require('chaplin');

  // Application-specific utilities
  // ------------------------------

  // Shortcut to the mediator
  var mediator = Chaplin.mediator;

  // Delegate to Chaplin’s utils module
  var utils = Chaplin.utils.beget(Chaplin.utils);

  _(utils).extend({
    // Bind local (prototype) methods, excluding 'constructor'.
    bindLocal: function(obj) {
      var args = [obj];
      var methods = _(obj).chain().methods().filter(function(name) {
        if (name === 'constructor') {
          return false;
        }
        return true;
      }).value();
      args = args.concat(methods);
      _.bindAll.apply(this, args);
    },

    strToNum: function(str) {
      var num = 0;
      for (var i = 0, len = str.length; i < len; i+=3) {
        num += str.charCodeAt(i);
      }
      return num;
    },

    strToHex: function(str) {
      var num = utils.strToNum(str);
      return (num % 15).toString(16);
    },

    isMobile: function() {
      var useragent = navigator.userAgent.toLowerCase();
      if( useragent.search("android") > -1 ) {
        return true;
      }
      else if (screen.width <= 480) {
        return true;
      }
      return false;
    },

    formatDate: function(date, format) {
      if (!date) {
        date = new Date();
      }
      if (!format) {
        format="MM/dd hh:mm t";
      }

      var month = date.getMonth() + 1;
      var year = date.getFullYear();

      format = format.replace("MM",month.toString().padL(2,"0"));

      if (format.indexOf("yyyy") > -1)
          format = format.replace("yyyy",year.toString());
      else if (format.indexOf("yy") > -1)
          format = format.replace("yy",year.toString().substr(2,2));

      format = format.replace("dd",date.getDate().toString().padL(2,"0"));

      var hours = date.getHours();
      if (format.indexOf("t") > -1)
      {
         if (hours > 11)
          format = format.replace("t","pm");
         else
          format = format.replace("t","am");
      }
      if (format.indexOf("HH") > -1)
          format = format.replace("HH",hours.toString().padL(2,"0"));
      if (format.indexOf("hh") > -1) {
          if (hours > 12) hours -= 12;
          if (hours === 0) hours = 12;
          format = format.replace("hh",hours.toString()); //.padL(2,"0"));
      }
      if (format.indexOf("mm") > -1)
         format = format.replace("mm",date.getMinutes().toString().padL(2,"0"));
      if (format.indexOf("ss") > -1)
         format = format.replace("ss",date.getSeconds().toString().padL(2,"0"));
      return format;
    }
  });

  // Extends String for the format date about.. not ideal.. fix later.
  String.repeat = function(chr,count) {
    var str = "";
    for (var x=0;x<count;x++) {str += chr;}
    return str;
  };
  String.prototype.padL = function(width,pad) {
    if (!width ||width<1)
      return this;

    if (!pad) pad=" ";
    var length = width - this.length;
    if (length < 1) return this.substr(0,width);

    return (String.repeat(pad,length) + this).substr(0,width);
  };
  String.prototype.padR = function(width,pad) {
    if (!width || width<1)
      return this;

    if (!pad) pad=" ";
    var length = width - this.length;
    if (length < 1) this.substr(0,width);

    return (this + String.repeat(pad,length)).substr(0,width);
  };

  return utils;
});