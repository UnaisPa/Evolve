const isotpVerfied = async(req,res,next)=>{
    try{
        if(req.session.otpVerified){
            if(req.session.otpVerified !=="verified"){
                const id= req.session.otpVerified
                console.log('sucsss + '+id);
               // res.redirect(`/`);
               next()
            }else{
                next()
            }
        }else{
            next();
        }
    }catch(err){
        throw new Error(err);
    }
}

module.exports = {isotpVerfied}