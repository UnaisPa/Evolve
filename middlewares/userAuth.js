const User  = require('../model/userModel');
const isLogin = async(req,res,next)=>{
    try{
        if(req.session.isAuthUser){
            //console.log(req.session.isAuthUser.toString());
            const id =req.session.isAuthUser.toString();
            const checkUserIsBlocked = await User.findOne({_id:id})
            if(checkUserIsBlocked.is_blocked==true){
                let name = checkUserIsBlocked.name
                res.render('userBlocked',{name})
                //res.send('You are blocked')
            }else{
            next();
            }
        }else{
            res.redirect('/')
        }
    }catch(err){
        throw new Error(err)
    }
}

const isLogout = async(req,res,next)=>{
    try{
        if(req.session.isAuthUser){
            res.redirect('/home')
        }else{
            next();
        }
    }catch(err){
        throw new Error(err);
    }
}
const check = async(req,res,next)=>{
    try{
        if(req.session.isAuthUser){
            res.redirect('/home')
        }else{
            next();
        }
    }catch(err){
        throw new Error(err);
    }
}

module.exports={isLogin,isLogout,check};