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
                'unit sold':data[4],
                'unit price':data[5],
                'unit cost':data[6],
                'total revenue':data[7],
                'total cost':data[8],
                'total profit':data[9]
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
    }
}