/*
  Author: Matthew Dobie
  Author URL: mattdobie.com
  Description: Server file for Image Search Abstraction Layer
*/


// Imports
var express = require('express');
var mongo = require('mongodb').MongoClient;
var request = require('request');
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
app.get('/search/:search*', function(req, res) {

  var query = req.params.search;

  // Save search
  //saveSearch();

  // Determine offset
  var offset = 1;
  if (req.query.offset) {
    offset = parseInt(req.query.offset) * 10;
  }

  // Search and display results
  var searchURL = "https://www.googleapis.com/customsearch/v1?"
  + "key=" + KEY
  + "&cx=" + CX
  + "&searchType=image"
  + "&q=" + query
  + "&start=" + offset;

  request.get(searchURL, function(err, data) {
    if (err) {
      res.send({Error: err});
    }
    else {
      var results = JSON.parse(data.body);
      var list = results.items;
      if (list) {
        var images = [];
        for (var i = 0; i < list.length; i++) {
          var imageDetails = {
            url: list[i].link,
            snippet: list[i].snippet,
            thumbnail: list[i].image.thumbnailLink,
            context: list[i].image.contextLink
          };
          images.push(imageDetails);
        }
        res.send(images);
      }
      else {
        res.send({Error: "No results!"});
      }
    }
  });

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
});
