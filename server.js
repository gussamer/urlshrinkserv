var express = require('express');
var app = express();
var lp = process.env.PORT || 8080;

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(lp, function () {
    console.log('Example app listening on port '+lp+'!');
});