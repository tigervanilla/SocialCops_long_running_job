var multer=require('multer');
var fs = require('fs');
var csv = require('fast-csv');
var MongoClient=require('mongodb').MongoClient;
var ObjectId=require('mongodb').ObjectID;
var dbConfig=require('./../config/dbConfig');

module.exports={
    showHome:(req,res,next)=>{
        res.render('dashboard',{'title':'Express',});
    },

    uploadFile:(req,res,next)=>{
        if(!req.file){
            res.json({'msg':'Invalid file'});
        }
        console.log("Upload Successfull with filename : ",req.file);
        var fileRows = [];
        csv.fromPath(req.file.path)
        .on("data", function (data) {
            var row={
                'region':data[0],
                'country':data[1],
                'itemtype':data[2],
                'channel':data[3],
                'priority':data[4],
                'order date':new Date('"'+data[5]+'"'),
                'order id':data[6],
                'ship date':new Date('"'+data[7]+'"'),
                'unit sold':data[8],
                'unit price':data[9],
                'unit cost':data[10],
                'total revenue':data[11],
                'total cost':data[12],
                'total profit':data[13],
                'original-csv-file':req.file.originalname
            }
            fileRows.push(row); 
        })
        .on("end", function () {
            // console.log(fileRows);
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

    getDataOverview:(req,res,next)=>{
        var startDate=req.body.startDate;
        var endDate=req.body.endDate;
        // console.log(startDate,endDate)
        MongoClient.connect(dbConfig.url,{useNewUrlParser:true},(err,db)=>{
            if(err){
                console.log(err);
                res.json({'msg':'some error occoured'});
            }
            var collection=db.db(dbConfig.database).collection('sales');
            var filter={'order date':{$gte:new Date(startDate)},'order date':{$lte:new Date(endDate)}}
            collection.find(filter).toArray((err,docs)=>{
                if(err){
                    console.log(err);
                    res.json({'msg':'some error occoured'});
                }
                // console.log(docs.length);
                res.render('data_overview',{
                    'docs':docs,
                    'isDataAvailable':docs.length>0
                });
            })
        })
    },

    uploadBulkTeamFile:(req,res,next)=>{
        // console.log(req.file);
        var teamFilePath=req.file.path;
        res.render('confirm_team',{'msg':'file upload successful','filePath':teamFilePath});
    },

    createBulkTeam:(req,res,next)=>{
        // console.log(req.body);
        if(req.body.createTeam==1){
        var fileRows = [];
        csv.fromPath(req.body.filePath)
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
            // console.log(fileRows.length);
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
                    // console.log(r.insertedCount);
                });
            });
            res.json({'msg':'teams successfully created'});
        })
    }else{
        fs.unlinkSync(req.body.filePath);   //delete the csv file
        res.json({'msg':'teams discarded'});
    }
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
                res.render('teams',{
                    'docs':docs,
                    'isDataAvailable':docs.length>0
                })
                // res.json(docs);
            })
        })
    },

    getTeamById:(req,res,next)=>{
        var teamId=req.params.teamId;
        MongoClient.connect(dbConfig.url,{useNewUrlParser:true},(err,db)=>{
            if(err){
                console.log(err);
                res.json({'msg':'some error occured'});
            }
            var collection=db.db(dbConfig.database).collection('teams');
            var filter={'_id':ObjectId(teamId)};
            collection.findOne(filter,(err,teamDoc)=>{
                if(err){
                    console.log(err);
                    res.json({'msg':'some error occured'});
                }
                res.json(teamDoc);
            })
        })
    },

    deleteSalesRecordByCsvName:(req,res,next)=>{
        var originalCsvName=req.body.originalCsvName;
        MongoClient.connect(dbConfig.url,{useNewUrlParser:true},(err,db)=>{
            if(err){
                console.log(err);
                res.json({'msg':'some error occured'});
            }
            var collection=db.db(dbConfig.database).collection('sales');
            var filter={'original-csv-file':originalCsvName};
            collection.deleteMany(filter,(err,result)=>{
                if(err){
                    console.log(err);
                    res.json({'msg':'some error occured'});
                }
                if(result.deletedCount!=0)
                    res.json({'msg':result.deletedCount+" Records Deleted"});
                else
                    res.json({'msg':"File Not Found"});
            })
        })
    },

    dataOverviewForm:(req,res,next)=>{
        res.render('data_overview',{'isDataAvailable':false});
    },
}