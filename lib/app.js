/**
 * Search App
 */

var cantina = require('cantina'),
  SearchManager = require('./search-manager');

// Create and export the app.
var app = module.exports = cantina.createApp({
  // app options here ...
  amino: false,
  port: process.argv[2] || 8080
});

// Attach plugins
app.use('static');
app.use('socketio', {silent: true});
app.use('elasticsearch', {
    host: '23.23.193.153',
    port : 9200,
    path : '/search-prototype'
  }
);

app.searchManager = new SearchManager(app);

