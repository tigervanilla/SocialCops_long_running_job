module.exports={
    showHome:(req,res,next)=>{
        res.render('index',{
            'title':'Express',
        });
    }
}