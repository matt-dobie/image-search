/*
  Author: Matthew Dobie
  Author URL: mattdobie.com
  Description: Server file for Image Search Abstraction Layer
*/


// Imports
var express = require('express');
var mongo = require('mongodb').MongoClient;
require('dotenv').config();

// Variables
var app = express();
var PORT = process.env.PORT || 8080;
var ROOT = "https://fcc-image-search-md.glitch.me/";
var CX = process.env.CX;
var KEY = process.env.KEY;
var DB_USER = process.env.DB_USER;
var DB_PASSWORD = process.env.DB_PASSWORD;
var mongoURL = "mongodb://" + DB_USER + ":" + DB_PASSWORD + "@ds041164.mlab.com:41164/image-search";
var db;


// Connect to mongo and listen for requests
mongo.connect(mongoURL, function(err, database) {
  if (err) return console.log(err);
  db = database;
  app.listen(PORT, function() {
    console.log("Listening on port " + PORT + "...");
  });
});

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
