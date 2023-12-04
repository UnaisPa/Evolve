const User = require('../model/userModel')
const generateOTP = require('../config/generateOTP')
const sendOTPByEmail = require('../config/sendOTPbyEmail')
const DealOfMonth = require('../model/dealOfModel');
const Product = require('../model/productModel');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcrypt')
const Cart = require('../model/cartModel');
const Review = require('../model/reviewModel');
const Wallet = require('../model/walletModel');
const Banner = require('../model/bannerModel');
const { generateRazorPay } = require('../helper/razorpayHelper');
const mongoose = require('mongoose');
const loadHome = async(req,res)=>{
    try{
        const rawData = await Product.find().sort({category:1}).limit(8);
        const processedData = rawData.map(item => ({
          ...item.toObject(),
          // Add properties as "own properties" as needed
          ownProperty: item.mobile,
        }));
        const dealOfMonth = await DealOfMonth.findOne();
        const banner = await Banner.findOne();

        // Now, pass processedData to your Handlebars template

        res.render('homeUser',{header:true,getAllProducts:processedData,dealOfMonth,banner:banner});
    }catch(err){
        throw new Error(err)
    }
}

const loadLogin = async(req,res)=>{
    const invalidU=req.query.invalidU
    const invalidP=req.query.invalidP
    if(invalidU){
        return res.render('loginUser',{invalidU})
    }
    if(invalidP){
        return res.render('loginUser',{invalidP})
    }

    res.render('loginUser')
}
//forgot passwrod
const loadForgot = async(req,res)=>{
    try{
        const invalidEmail=req.query.invalidEmail
        const invalidOtp = req.query.invalidOtp
        const success = req.query.success
        if(invalidEmail){
        return res.render('forgotPassword',{invalidEmail});

        }
        if(invalidOtp){
            return res.render('forgotPassword',{invalidOtp});
        }
        if(success){
            let id = req.query.userID
            const check = await User.findOne({_id:id});
            if(check){
                const email = check.email
                return res.render('forgotPassword',{success,email});
            }
           
        }

        res.render('forgotPassword');
    }catch(err){
        throw new Error(err)
    }
}

const sendOtpForForgotPassword = async(req,res)=>{
    try{
        const email = req.body.email
        const checkEmail = await User.findOne({email:email});
        if(checkEmail){
            const otp = generateOTP()
            await User.updateOne({email:email},{$set:{otp:otp}});
            sendOTPByEmail.sendOtpForgotPassword(email,otp)
            res.redirect(`/forgot_password?success=true&userID=${checkEmail._id}`);
        }else{
            res.redirect(`/forgot_password?invalidEmail=true`);
        }
    }catch(err){
        throw new Error(err)
    }
}

const verifyForgotPasswordOtp = async(req,res)=>{
    try{
        const otp = req.body.otp
        const email = req.body.email
        console.log(otp)
        const checkEmail = await User.findOne({email:email});
        var orginalOtp = checkEmail.otp
        console.log(orginalOtp)
        if(otp==orginalOtp){
            //res.render('newPassword');
            const id = checkEmail._id
            res.json({status:'success',id:id})
        }else{
            res.json({status:'error',message:'Invalid OTP'})
        }
    }catch(err){
        throw new Error(err)
    }
}
const loadRegister = async(req,res)=>{
    const useralreadyexist = req.query.useralreadyexist
    if(useralreadyexist){
       return res.render('register',{useralreadyexist})
    }
    res.render('register')
}

//set new Password
const loadNewPassword= async(req,res)=>{
    try{
        const id = req.query.id
        if(id){
            res.render('newPassword',{id});
        }else{
            res.redirect('/login');
        }
    }catch(err){
        throw new Error(err)
    }
}

const updatePassword = async(req,res)=>{
    try{
        const {password,id} = req.body
        
        const user = await User.findOne({_id:id});
       
        const hashedPassword = await bcrypt.hash(password, 10)
        const updatePassword = await User.updateOne({_id:id},{$set:{password:hashedPassword}})
        
        //console.log(updatePassword.password);
        if(updatePassword){
            console.log(user.password);
            res.redirect('/login');
        }
       
    }catch(err){
        throw new Error(err)
    }
}
//load Home for verified user
const loadHomeVerifiedUser = async(req,res)=>{
    try{
        
        const rawData = await Product.find().sort({category:1}).limit(8);
        const processedData = rawData.map(item => ({
          ...item.toObject(),
          // Add properties as "own properties" as needed
          ownProperty: item.mobile,
        }));
        //deal of month
        const dealOfMonth = await DealOfMonth.findOne();

        const banner = await Banner.findOne();
        // total quantity of cart
        const user = await Cart.findOne({user:req.session.isAuthUser});
        if(user){
            var cartItemsCount = user.cartItems.reduce((acc,product)=>{
                return acc += product.quantity;
             },0)
        }
        if(cartItemsCount==0){
            cartItemsCount=false;
        }
        res.render('homeUser',{verified:true,header:true,getAllProducts:processedData,cartItemsCount,dealOfMonth,banner:banner})
    }catch(err){
        console.log(err)
    }
}
//POST 
const createUser = async(req,res)=>{
    try{
        const {name,mobile,email,password} = req.body
        const checkUser = await User.findOne({$or:[{email:email},{mobile:mobile}]});
        if(checkUser){
            let useralreadyexist = true
            res.redirect(`/register?useralreadyexist=${useralreadyexist}`)
        }else{
            
        const otp = generateOTP()
        const user = new User({
            name:name,
            mobile:mobile,
            email:email,
            password:password,
            otp:otp
        })
        
        await user.save()
        const object = user._id
        console.log(object.toString());
        console.log(otp);
        sendOTPByEmail.sendOTPByEmail(email,otp)
        req.session.otpVerified = user._id
        res.redirect(`/verify-user/${object}`);
        //res.status(201).json({ message: 'User registered successfully' });
        
        }
    }catch(err){
        throw new Error(err)
    }
}

//GET - for resend OTP
const resendOTP = async(req,res)=>{
    try{
        const {id} = req.params
        const otp = generateOTP()
        const updateOTP = await User.updateOne({_id:id},{$set:{otp:otp}})
        const user = await User.findOne({_id:id});
        
        const updateTime = await User.updateOne({_id:id},{$set:{expiresAt:Date.now()+ 5 * 60 * 1000}})
        if(updateOTP && updateTime){
            const email = user.email
            sendOTPByEmail.sendOTPByEmail(email,otp)
            //res.render('verifyOTP',{resended:true})
            res.redirect(`/verify-user/${id}`);
        }
        

    }catch(err){
        throw new Error(err)
    }
}

// GET - for load verify user page (OTP)
const loadVerifyUser = async (req,res)=>{
    const invalidotp = req.query.invalidotp
    const otpExpired = req.query.otpExpired
    const id = req.params.id
    console.log(id)
    try{
        if(otpExpired){
            return res.render('verifyOTP',{otpExpired,id:id})
        }
        if(invalidotp){
            return res.render('verifyOTP',{invalidotp:invalidotp,id:id})
        }else{
            return res.render('verifyOTP',{id:id})
        }

        
        res.render('verifyOTP');
    }catch(err){
        console.log(err)
    }
}

//POST - verifyOTP
const verifyUser = async (req, res) => {
    //const { email, otp } = req.body;
    //console.log(req.body.id+"  "+req.body.otp )
    let otp = req.body.otp
    //console.log(email);
    try {
      const user = await User.findOne({_id:req.body.id});
      console.log(user.otp);
      //console.log(user.otp)
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      if (user.otp !== Number(otp)) {
        console.log(otp)
        const invalidotp=true
        return res.redirect(`/verify-user/${user._id}?invalidotp=${invalidotp}`)
        
        //return res.status(401).json({ error: 'Invalid OTP' });
      }else if(user.expiresAt){
          //console.log(user.expiresAt)
          if(user.expiresAt>new Date()){
            console.log('scccccccc');
        }  
      await User.updateOne({_id:req.body.id},{$set:{verified:true}})
      // Mark user as verified, update database, or perform further actions
      // Optionally, you can generate and return an authentication token 
      req.session.otpVerified = 'verified'
      //session
      req.session.isAuthUser=user._id
      res.redirect('/home')
      //res.status(200).json({ message: 'OTP verified successfully' });
     }else{
        console.log(user.expiresAt)
        console.log(new Date());
        if(user.expiresAt>new Date()){
            console.log('scccccccc');
        } 
        const otpExpired=true
        return res.redirect(`/verify-user/${user._id}?invalidotp=${otpExpired}`)
     }
    } catch (error) {
      console.error(error);
        //res.redirect(`/verify-user/${user._id}?invalidotp=${invalidotp}`)
      res.status(500).json({ error: 'OTP verification failed' });
    }
}

const checkUser = async(req,res)=>{
    try{
        const {email, password} = req.body
        const checkUser = await User.findOne({email:email})
        if(checkUser){
            bcrypt.compare(password, checkUser.password, (err, result) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    return;
                }
            
                if (result) {
                    if(checkUser.verified===true && checkUser.is_blocked===false){
                        console.log('Matched')
                        req.session.isAuthUser=checkUser._id
                        res.redirect('/home')
                    }else{
                        console.log('not matched');
                        const invalidU=true
                        res.redirect(`/login?invalidU=${invalidU}`);
                    }
                }   else {
                    console.log('Passwords do not match. Authentication failed.');
                    const invalidP=true
                    res.redirect(`/login?invalidP=${invalidP}`);
                }
              });
        }else{
            const invalidU=true
            res.redirect(`/login?invalidU=${invalidU}`);
        }
    }catch(err){
        console.log(err)
        //throw new Error(err)
    }
}
//view single product details GET
const loadViewProduct = async(req,res)=>{
    const {id} = req.params
    const product =  await Product.findOne({_id:id})
    const discount = product.price-product.offerprice
    const wishlist = product.wishlist
    const cart = product.cart
    const percentage = Math.round(  ((product.price - product.offerprice) /  product.price) * 100)

    if(product.category=='Sofa'){
        var Sofa = product.category 
    }else if(product.category =='Lighting'){
        var Lighting = product.category
    }else if(product.category=='Chairs'){
        var Chairs = product.category
    }else if(product.category=='Decor Items'){
        var Decor = product.category
    }
    //Ratings calculations
    const reviews = await Review.find({product:product.name});
    const countReview = await Review.countDocuments({product:product.name})
    const count5 = await Review.countDocuments({product:product.name,rating:5})
    const count4 = await Review.countDocuments({product:product.name,rating:4})
    const count3 = await Review.countDocuments({product:product.name,rating:3})
    const count2 = await Review.countDocuments({product:product.name,rating:2})
    const count1 = await Review.countDocuments({product:product.name,rating:1})

    //percentage
    let c5 = ((count5/countReview)*100).toFixed(1)
    let c4 = ((count4/countReview)*100).toFixed(1)
    let c3 = ((count3/countReview)*100).toFixed(1)
    let c2 = ((count2/countReview)*100).toFixed(1)
    let c1 = ((count1/countReview)*100).toFixed(1)

    const totVal = (count5*5)+(count4*4)+(count3*3)+(count2*2)+(count1*1)
    let average = totVal/countReview
    average = average.toFixed(1);
    avg = Math.round(average)
    
    const processReviews = reviews.map(item => ({
        ...item.toObject(),
        // Add properties as "own properties" as needed
        ownProperty: item.mobile,
    }));
    let productCategory = product.category
    const moreProducts = await Product.find({$and:[{"_id":{$ne:id}},{category:productCategory}]}).limit(8);
    const processedData = moreProducts.map(item => ({
        ...item.toObject(),
        // Add properties as "own properties" as needed
        ownProperty: item.mobile,
    }));
    if(req.session.isAuthUser){
        const user = await User.findOne({_id:req.session.isAuthUser});
        let cartItem = user.cart.length
        if(cartItem==0){
            cartItem=false;
        }
        return res.render('viewProduct',{verified:true,discount,product:product,Sofa:Sofa,Lighting,Chairs,Decor,percentage,id,wishlist,cart,cartItem,getAllProducts:processedData,reviews:processReviews,countReview,average,avg,c5,c4,c3,c2,c1})
    }else{
    res.render('viewProduct',{discount,product:product,Sofa:Sofa,Lighting,Chairs,Decor,percentage,id:id,wishlist,cart,getAllProducts:processedData,notLogin:true,reviews:processReviews,countReview,average,avg,c5,c4,c3,c2,c1});
    }
}
  
  

//Wallet operations
const loadWallet = async(req,res)=>{
    try{
        const user = req.session.isAuthUser
        let wallet = await Wallet.findOne({userId:user})
        if(!wallet){
            wallet = new Wallet({userId:user});
            wallet.save();
        }
        const transactionHistory = wallet.walletHistory
        // const processedData = transactionHistory.map(item => ({
        //     ...item.toObject(),
        //     // Add properties as "own properties" as needed
        //     ownProperty: item.mobile,
        // }));
        res.render('wallet',{verified:true,wallet,transactionHistory});
    }catch(err){
        console.log(err);
    }
}

const rechargeWallet = async(req,res)=>{
    try{
        let amount = req.body.amount
        console.log(amount);
        amount = Number(amount);
        const orderId = ""+Date.now()
        generateRazorPay(orderId,amount).then((response)=>{
            res.json({status:'success',response})
        }) 
    }catch(err){
        console.log(err)
    }
}



module.exports={
    loadHome,
    loadLogin,
    loadRegister,
    loadForgot,
    sendOtpForForgotPassword,
    verifyForgotPasswordOtp,
    loadNewPassword,
    updatePassword,
    createUser,
    verifyUser,
    resendOTP,
    loadVerifyUser,
    loadHomeVerifiedUser,
    checkUser,
    loadViewProduct, 
    loadWallet,
    rechargeWallet
}