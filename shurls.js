var mongoURL = process.env.MONGOLAB_URI;
console.log('mongoURL: '+mongoURL);
var mongo = require('mongodb').MongoClient;
var auto = require('mongodb-autoincrement');

var Shurls = {};

Shurls.createShurls = function(callback){
    mongo.connect(mongoURL,function(err,db){
        if(err){
            console.log("[-]ShurlClient.createShurls: Failed to connect to mongodb on url: "+mongoURL);
            console.log(err);
            callback(err);
        }else{
            db.createCollection("shurls",{"capped":true,"size":1000000,"max":10000},function(err,coll){
                if(err){
                    console.log("[-]ShurlClient.createShurls: Failed to create shurls collection");
                    console.log(err);
                    db.close();
                    callback(err);
                }else{
                    coll.createIndex({shurl:1},{unique:true},function(err,result){
                        if(err){
                            console.log("[-]ShurlClient.createShurls: Failed to create shurl index");
                            console.log(err);
                            db.close();
                            callback(err,result);
                        }else{
                            console.log(result);
                            db.close();
                            callback(err,result);
                        }
                    });
                }
            });
        }
    });
};

Shurls.createShurl = function(url,callback){
    mongo.connect(mongoURL,function(err,db){
        if(err){
            console.log("[-]ShurlClient.createShurl: Failed to connect to mongodb on url: "+mongoURL);
            console.log(err);
            callback(err);
        }else{
            auto.getNextSequence(db,'shurls','shurl',function(err,nextShurl){
                if(err){
                    console.log("[-]ShurlClient.createShurl: Failed to get next shurl");
                    console.log(err);
                    callback(err);
                }else{
                    db.collection("shurls").insert({"shurl":nextShurl,"url":url},function(err,result){
                        if(err){
                            console.log("[-]ShurlClient.createShurl: Failed to create shurl");
                            console.log(err);
                            db.close();
                            callback(err,result);
                        }else{
                            console.log("[+]ShurlClient.createShurl: created shurl");
                            console.log(result);
                            db.close();
                            callback(err,result);
                        }
                    });
                }
            });
        }
    });
};

Shurls.getShurl = function(fshurl,callback){
    mongo.connect(mongoURL,function(err,db){
        if(err){
            console.log("[-]ShurlClient.createShurl: Failed to connect to mongodb on url: "+mongoURL);
            console.log(err);
            callback(err);
        }else{
            var q = {shurl:fshurl};
            console.log(q);
            db.collection("shurls").findOne(q,function(err,result){
                if(err||!result){
                    console.log("[-]ShurlClient.createShurl: Failed to find shurl");
                    console.log(err);
                    db.close();
                    callback(err,result);
                }else{
                    console.log("[+]ShurlClient.createShurl: found shurl");
                    console.log(result);
                    db.close();
                    callback(err,result);
                }
            });
        }
    });
};

module.exports = Shurls;