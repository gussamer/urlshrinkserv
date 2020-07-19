var express = require('express');
var shurls = require('./shurls.js');
//todo: fix depends
var app = express();
var lp = process.env.PORT || 8080;

var sendDescription = function(res){
  res.send('<html><head></head><body><h1>URL Shrinker Service</h1><h3>Usage:</h3><br><div><ul>'
  +'<li>HOST/new/:url - Insert new urls using the form "/new/:url" where url is the url to be redirected, returns a shortened url'
  +'<li>HOST/:shurl - Redirect to the url stored at the :shurl url id on the end of the hostname'
  +'</ul></div></body><html>');
};

app.get('/', function(req, res){
  sendDescription(res);
});

app.get('/create/',function(req,res){
  shurls.createShurls(function(err,result){
    if(err){
      console.log('[-]server.app: Creation of Shurls failed');
      console.log(err);
      res.json(err);
    }else{
      console.log('[-]server.app: Created Shurls');
      console.log(result);
      res.json(result);
    }
  });
});

app.get(/\/new\/[.]*/, function(req, res){
  console.log(req.path);
  var url = /(\/new\/)(.*)/.exec(req.path)[2];
  console.log(url);
  if(/(https?:\/\/)(www\.)?(.*\..*)(:\d*)?/.test(url)){
    shurls.createShurl(url,function(err,result){
      if(err){
        console.log('[-]server.app: Creation of Shurl failed');
        console.log(err);
        res.json({"err":err});
      }else{
        console.log('[-]server.app: Created Shurl');
        console.log(result);
        res.json({"original_url":url,"short_url":req.hostname+'/'+result.ops[0].shurl});
      }
    });
  }else{
    console.log('[-]server.app: Received malformed url: '+url);
    sendDescription(res);
  }
});

app.get('/:shurl', function(req, res){
  if(!/[^\d]/.test(req.params.shurl)){
    try{
      var shurlint = parseInt(req.params.shurl);
      shurls.getShurl(shurlint,function(err,result){
        if(err||!result){
          console.log('[-]server.app: Retrieval of Shurl failed');
          console.log(err);
        }else{
          console.log('[+]server.app: Found Shurl');
          console.log(result);
          res.redirect(result.url);
        }
      });
    }catch(e){
      console.log(e);
      sendDescription(res);
    }
  }else{
    console.log('[-]server.app: Received no shurl');
    sendDescription(res);
  }
});

app.listen(lp, function(){
    console.log('[+]server.app: Example app listening on port '+lp+'!');
});