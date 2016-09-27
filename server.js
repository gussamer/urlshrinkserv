var express = require('express');
var mongo = require('mongodb').MongoClient;
var mongoUname = 'gussamer';
var mongoPword = 'V0idnu11';
var mongoURL = 'mongodb://'+encodeURIComponent(mongoUname)+':'+encodeURIComponent(mongoPword)+'@ds019806.mlab.com:19806/urlshrinker';
var app = express();
var lp = process.env.PORT || 8080;

var shurlWorker = function(op,input){
  mongo.connect(mongoURL,function(conerr,db){
    if(conerr){
      console.log('Failed to connect: ',conerr);
    }else{
      console.log('Connected on: ',mongoURL);
      var shurls = db.collection('shrunkurls');
      if(op=='insertshurl'){
        var inputString = JSON.stringify(input);
        shurls.insert(inputString,function(inserr,data){
          if(inserr) console.log(inserr);
          mongo.close();
          return data;
        });
      }else if(op==''){
        
      }
    }
  });
}

app.get('/', function(req, res){
  res.send('Hello World!');
});

app.get('/new/:url', function(req, res){
  res.send(JSON.stringify(('insertshurl',req.params.url)));
});

app.listen(lp, function(){
    console.log('Example app listening on port '+lp+'!');
});