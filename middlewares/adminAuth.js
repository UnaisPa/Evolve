const isLogin = async(req,res,next)=>{
    try{
        if(req.session.isAuthAdmin){
            next();
        }else{
            res.redirect('/admin')
        }

    }catch(err){
        console.log(err)
    }
}

const isLogout = async(req,res,next)=>{
    try{
        if(req.session.isAuthAdmin){
            res.redirect('/admin/dashboard')
        }else{
            next()
        }

    }catch(err){
        console.log(err);
    }
}

module.exports = {isLogin,isLogout};