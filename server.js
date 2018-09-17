'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser= require('body-parser');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

var dns = require('dns');
var URL = require("url");
var timeout = 10000;
var shURL = require('./myApp.js').shURLmodel;
var createURL = require('./myApp.js').createURL;

function isUrl(s) {
   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
   return regexp.test(s);
}

app.post("/api/shorturl/new" , function(req,res,next){
  var url = req.body.url;
  var r = URL.parse(url);
  const options = {
    family: null
  };
  if (!isUrl(url)){
    res.json({error: "invalid URL"});
  }
  else {
  dns.lookup(r.hostname, options, function (err, addresses, family) {
    console.log(addresses);
    if (!addresses)
      res.json({error: "invalid URL"});
    else {
      // in case of incorrect function use wait timeout then respond
      var t = setTimeout(() => { next({message: 'timeout'}) }, timeout);
      createURL(url, function(err, data) {
      clearTimeout(t);
      if(err) { return (next(err)); }
      if(!data) {
        console.log('Missing `done()` argument');
        return next({message: 'Missing callback argument'});
      }
      res.json({original_url: data.original_url, short_url: data.short_url});
      });
    }
  });
  }
});

var findURL = require('./myApp.js').findURL;
app.get('/api/shorturl/:new', function(req,res,next){
  if (!req.params.new) { res.send("Not found") }
  else {
  var t = setTimeout(() => { next({message: 'timeout'}) }, timeout);
  findURL(req.params.new , function(err, data){
    if(err) { return next(err) }
    if(!data) {
      //console.log('Missing `done()` argument');
      
      res.json({error: "No short url found for given input"});
      return next({message: 'Missing callback argument'});
    }
    res.redirect(data.original_url);
    
  });
  }
});

app.get('/api/shorturl' , function(req,res){
  res.send("Not found");
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});