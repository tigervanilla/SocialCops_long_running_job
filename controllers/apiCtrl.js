var multer=require('multer');

module.exports={
    showHome:(req,res,next)=>{
        res.render('index',{'title':'Express',});
    },

    uploadFile:(req,res,next)=>{
        console.log("Uploaded Successfull with filename : ",req);
        res.render('index',{'title':'File Upload Successful'});
    }
}