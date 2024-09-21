var redisURL = process.env.REDISCLOUD_URL;
var redis = require('redis');
var client = redis.createClient(redisURL, {no_ready_check: true});
client.auth(redisURL);

var Redisurls = {};

Redisurls.createShurls = function(callback){
  mongo.connect(mongoURL,function(err,client){
      if(err){
          console.log("[-]ShurlClient.createShurls: Failed to connect to redis on url: "+redisURL);
          console.log(err);
          callback(err);
      }else{
          db.createCollection("shurls",{"capped":true,"size":1000000,"max":10000},function(err,coll){
              if(err){
                  console.log("[-]ShurlClient.createShurls: Failed to create shurls collection");
                  console.log(err);
                  client.close()
                  callback(err);
              }else{
                  coll.createIndex({shurl:1},{unique:true},function(err,result){
                      if(err){
                          console.log("[-]ShurlClient.createShurls: Failed to create shurl index");
                          console.log(err);
                          client.close()
                          callback(err,result);
                      }else{
                          console.log(result);
                          client.close()
                          callback(err,result);
                      }
                  });
              }
          });
      }
  });
};

const iteratorKey = 'iterator';

Redisurls.createShurl = function(url,callback){
  client.get(iteratorKey, function (err, iteratorReply) {
    if(err){
        console.log("[-]ShurlClient.getShurl: Failed to get iterator");
        console.log(err);
        client.set(iteratorKey, 0, function (err, reply) {
          if(err){
              console.log("[-]ShurlClient.createShurl: Failed to create iterator");
              console.log(err);
              callback(err);
          }else{
            console.log("[+]ShurlClient.createShurl: created iterator");
            console.log(reply);
            callback(err,reply);
          }    
        });
    }else{
      var iterator = iteratorReply;
      
      client.set(iterator, fshurl, function (err, reply) {
        if(err){
            console.log("[-]ShurlClient.createShurl: Failed to create shurl");
            console.log(err);
            callback(err);
        }else{
          console.log("[+]ShurlClient.createShurl: created shurl");
          console.log(reply);
          callback(err,reply);
        }    
      });
    }    
  });
};

Redisurls.getShurl = function(fshurl,callback){
  client.get(fshurl, function (err, reply) {
    if(err){
        console.log("[-]ShurlClient.getShurl: Failed to get shrunken url");
        console.log(err);
        callback(err);
    }else{
      console.log("[+]ShurlClient.getShurl: found shurl");
      console.log(reply);
      callback(err,reply);
    }    
  });
};

module.exports = Shurls;