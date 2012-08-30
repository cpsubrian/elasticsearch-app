/**
 * Search App
 */

var cantina = require('cantina'),
  SearchManager = require('./search-manager');

// Create and export the app.
var app = module.exports = cantina.createApp({
  // app options here ...
  amino: false
});

// Attach plugins
app.use('static');
app.use('socketio', {silent: true});
app.use('elasticsearch', {
    host: 'localhost',
    port : 9200,
    path : '/search-prototype'
  }
);

app.searchManager = new SearchManager(app);

