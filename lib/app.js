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
  server: {
  //  host: 'ec2-184-73-67-132.compute-1.amazonaws.com',
    host: 'localhost',
    port : 9200
  },
  indexName : 'search-prototype'
});

app.searchManager = new SearchManager(app);

