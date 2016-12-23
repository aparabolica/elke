var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var url = require('url');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.post('/publish', function(req, res){
  var parts = url.parse(req.body.swfurl, true);
  var key = parts.query.key;
  if(key == 'ahoy')
    res.sendStatus(200);
  else
    res.sendStatus(403);
});
app.post('/publish_done', function(req, res){
  var parts = url.parse(req.body.swfurl, true);
  var key = parts.query.key;
  console.log(req.body);
  res.sendStatus(200);
});

app.listen(3030);
