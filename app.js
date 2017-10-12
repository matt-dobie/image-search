/*
  Author: Matthew Dobie
  Author URL: mattdobie.com
  Description: Server file for Image Search Abstraction Layer
*/


// Imports
var express = require('express');
var mongo = require('mongodb').MongoClient;

// Variables
var app = express();
var port = process.env.PORT || 8080;
var root = "https://fcc-image-search-md.glitch.me/";
//var mongoURL = process.env.MONGO_URL;
var db;


app.listen(port, function() {
    console.log("Listening on port " + port + "...");
  });

// Connect to mongo and listen for requests
/*mongo.connect(mongoURL, function(err, database) {
  if (err) return console.log(err);
  db = database;
  
});*/

// Serve static index page
app.use(express.static('public'));

// Route to index page
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Get call to search for images
app.get('/search/*', function(req, res) {
  res.json({searching: "yes"});
});

// Get latest searches
app.get('/latest', function(req, res) {
  res.json({history: "yes"});
});

// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if (err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})
