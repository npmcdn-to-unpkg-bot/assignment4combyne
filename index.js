// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');


var api = new ParseServer({
  databaseURI: 'mongodb://try:try@ds055862.mlab.com:55862/heroku_fx2ftj7z',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'PCceNdSbqYXTd2hN0KhKtiXr0BZGaALUX3WSCGx4',
  javascriptKey: process.env.JS_KEY || 'iuLbs25h7U54eD0TSAX1BhNTVVLLqFL3vj6eBu7a',
  masterKey: process.env.MASTER_KEY || 'eJC2cuumu6Mj3NQqRf7s2sDnXpqoW8fUD0sCWYRw', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://assignmentjn.herokuapp.com/parse',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});


var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
