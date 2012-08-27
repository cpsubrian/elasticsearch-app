/**
 * Adds shims for browser-specific javascript functionality.
 */
define(['jquery'], function($) {
  'use strict';

  if(!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g,'');
    };
  }

  // shim layer with setTimeout fallback
  window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame  ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  // Support for 'placeholder' attribute.
  $('body').on('focus', 'input[placeholder]', function(e) {
    var input = $(e.currentTarget);
    if (input.val() == input.attr('placeholder')) {
      input.val('');
      input.removeClass('placeholder');
    }
  });
  $('body').on('blur', 'input[placeholder]', function(e) {
    var input = $(e.currentTarget);
    if (input.val() == '' || input.val() == input.attr('placeholder')) {
      input.addClass('placeholder');
      input.val(input.attr('placeholder'));
    }
  });
  $('body').on('submit', 'form:has(input[placeholder])', function(e) {
    $(e.currentTarget).find('[placeholder]').each(function() {
      var input = $(this);
      if (input.val() == input.attr('placeholder')) {
        input.val('');
      }
    });
  });
});