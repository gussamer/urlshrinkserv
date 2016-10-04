var express = require('express');
var mongo = require('mongodb').MongoClient;
var mongoURL = process.env.MONGOLAB_URI;
var app = express();
var lp = process.env.PORT || 8080;

var getnext = function(col,name,callback){
  col.findAndModify({query:{_id:name},update:{$inc:{seq:1}},new:true},callback);
};

var shurlWorker = function(op,input){
  mongo.connect(mongoURL,function(conerr,db){
    if(conerr){
      console.log('Failed to connect: ',conerr);
    }else{
      console.log('Connected on: ',mongoURL);
      var shurls = db.collection('shrunkurls');
      if(op=='insertshurl'){
        getnext(shurls,'urlid',function(next){
          console.log(next);
          var dat = {_id:next,url:input};
          console.log(dat);
          shurls.insert(dat,function(inserr,data){
            if(inserr) console.log(inserr);
            db.close();
            return data;
          });
        });
      }else if(op==''){
        
      }
    }
  });
};

app.get('/', function(req, res){
  res.send('Hello World!');
});

app.get('/new/:url', function(req, res){
  console.log(req.params);
  res.json(JSON.stringify(shurlWorker('insertshurl',req.params.url)));
});

app.listen(lp, function(){
    console.log('Example app listening on port '+lp+'!');
});