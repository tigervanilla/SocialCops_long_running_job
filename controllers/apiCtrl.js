var multer=require('multer');
var fs = require('fs');
var csv = require('fast-csv');
var MongoClient=require('mongodb').MongoClient;
var dbConfig=require('./../config/dbConfig');

module.exports={
    showHome:(req,res,next)=>{
        res.render('index',{'title':'Express',});
    },

    uploadFile:(req,res,next)=>{
        console.log("Uploaded Successfull with filename : ",req.file.filename);
        var fileRows = [];
        csv.fromPath(req.file.path)
        .on("data", function (data) {
            var row={
                'region':data[0],
                'country':data[1],
                'itemtype':data[2],
                'channel':data[3],
                'priority':data[4],
                'date':new Date('"'+data[5]+'"'),
                'order id':data[6],
                'ship date':new Date('"'+data[7]+'"'),
                'unit sold':data[8],
                'unit price':data[9],
                'unit cost':data[10],
                'total revenue':data[11],
                'total cost':data[12],
                'total profit':data[13]
            }
            fileRows.push(row); 
        })
        .on("end", function () {
            console.log(fileRows);
            MongoClient.connect(dbConfig.url,{useNewUrlParser:true},(err,db)=>{
                if(err){
                    console.log(err);
                    res.json({'msg':'some error occured'});
                }
                var collection=db.db(dbConfig.database).collection('sales');
                collection.insertMany(fileRows,(err,r)=>{
                    if(err){
                        console.log(err)
                        res.json({'msg':'some error occured'});
                    }
                    console.log(r.insertedCount);
                });
            });
            fs.unlinkSync(req.file.path);   //delete the csv file
            res.json({'msg':'upload successful'});
        })
    },

    getSalesData:(req,res,next)=>{
        var startDate=req.params.startDate;
        var endDate=req.params.endDate;
        MongoClient.connect(dbConfig.url,{useNewUrlParser:true},(err,db)=>{
            if(err){
                console.log(err);
                res.json({'msg':'some error occoured'});
            }
            var collection=db.db(dbConfig.database).collection('sales');
            var filter={'date':{$gte:new Date(startDate)},'date':{$lte:new Date(endDate)}}
            collection.find(filter).toArray((err,docs)=>{
                if(err){
                    console.log(err);
                    res.json({'msg':'some error occoured'});
                }
                res.json(docs);
            })
        })
    },

    createBulkTeam:(req,res,next)=>{
        var fileRows = [];
        csv.fromPath(req.file.path)
        .on("data", function (data) {
            var row={
                'Name':data[0],
                'Description':data[1],
                'Managers':data[2],
                'Members':data[3]
            }
            fileRows.push(row); 
        })
        .on("end", function () {
            console.log(fileRows.length);
            MongoClient.connect(dbConfig.url,{useNewUrlParser:true},(err,db)=>{
                if(err){
                    console.log(err);
                    res.json({'msg':'some error occured'});
                }
                var collection=db.db(dbConfig.database).collection('teams');
                collection.insertMany(fileRows,(err,r)=>{
                    if(err){
                        console.log(err)
                        res.json({'msg':'some error occured'});
                    }
                    console.log(r.insertedCount);
                });
            });
            fs.unlinkSync(req.file.path);   //delete the csv file
            res.json({'msg':'teams successfully created'});
        })
    },

    getAllTeams:(req,res,next)=>{
        MongoClient.connect(dbConfig.url,{useNewUrlParser:true},(err,db)=>{
            if(err){
                console.log(err);
                res.json({'msg':'some error occured'});
            }
            var collection=db.db(dbConfig.database).collection('teams');
            collection.find().toArray((err,docs)=>{
                if(err){
                    console.log(err);
                    res.json({'msg':'some error occured'});
                }
                res.json(docs);
            })
        })
    }
}