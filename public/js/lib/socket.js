/**
 * Connect and expose a socket.io websocket on the mediator.
 */
define(function(require){
  'use strict';

  // Module dependencies.
  var Chaplin = require('chaplin'),
      io = require('socketio'),
      $ = require('jquery'),
      _ = require('underscore');

  var socket = io.connect();

  // Set up deferreds for common connection-oriented events.
  var events = [
    // Standard connection events.
    'connect', 'connecting', 'connect_failed',
    'disconnect', 'reconnect', 'reconnecting',
    'reconnect_failed',

    // App events we want to defer.
    'stats:counts'
  ];
  var deferreds = {};
  _.each(events, function(event) {
    deferreds[event] = $.Deferred(function() {
      socket.on(event, this.resolve);
    });
  });

  // Returns the deferred for an event.
  socket.when = function(event) {
    return deferreds[event];
  };

  // Fire the callback when the event is first called,
  // and then every time after that.
  socket.every = function(event, callback) {
    socket.when(event).then(function() {
      socket.on(event, callback);
      callback.apply(this, arguments);
    });
  };

  return socket;
});