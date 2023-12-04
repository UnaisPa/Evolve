const Coupon = require('../model/couponModel');
const User = require('../model/userModel');
const usedCoupon = require('../model/usedCouponModel');
const Cart = require('../model/cartModel');
//Admin side

const loadCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        const processedData = coupons.map(item => ({
            ...item.toObject(),
            // Add properties as "own properties" as needed
            ownProperty: item.mobile,
        }));
        res.render('coupons', { coupons: processedData });
    } catch (err) {
        console.log(err)
    }
}

const loadAddCoupons = async (req, res) => {
    try {
        res.render('add-coupons');
    } catch (err) {
        console.log(err)
    }
}
//POST method for add coupon
const addCoupon = async (req, res) => {
    try {
        const { couponCode, couponDescription, minOrder, maxDiscount, startingDate, expiryDate, discountPercentage } = req.body
        const checkCoupon = await Coupon.findOne({couponCode:couponCode})
        if(checkCoupon){
           return res.json({status:'warning',message:'Coupon code already exist,Please create unique one'});
        }
        const couponData = new Coupon({
            couponCode: couponCode,
            createdAt: startingDate,
            description: couponDescription,
            expiry: expiryDate,
            minOrderAmount: minOrder,
            discountAmount: maxDiscount,
            discountPercentage: discountPercentage
        });
        await couponData.save();
        res.json({ 'status': 'success' });
    } catch (err) {
        res.json({ status: 'error',message:err});
        console.log(err)
    }
}

//User side - apply coupon
const applyCoupon = async (req, res) => {
    try {
        const couponCode = req.query.couponcode
        let totalPrice = req.query.totalprice
        const user = req.session.isAuthUser
        console.log(couponCode, totalPrice);
        const checkCoupon = await Coupon.findOne({ couponCode: couponCode });
        if (checkCoupon) {
            let userCoupons = await usedCoupon.findOne({ userId: user });
            if (!userCoupons) {
                userCoupons = new usedCoupon({
                    userId: user,
                    userCoupons: []
                })
                await userCoupons.save();
                console.log('nooo')
            }
            if (userCoupons) {
                const findCoupon = userCoupons.userCouponse.filter((coupon)=>coupon.couponId.toString()  === checkCoupon._id.toString() );
                //console.log(findCoupon)
                if (!findCoupon.length) {
                    const maxAmount = checkCoupon.discountAmount;
                    let discountValue = parseFloat((checkCoupon.discountPercentage / 100) * totalPrice).toFixed(2);
                    let actualValue;
                    if (discountValue > maxAmount) {
                        actualValue = totalPrice - maxAmount;
                        discountValue = maxAmount
                    } else {
                        actualValue = totalPrice - discountValue
                    }
                    const updateCoupons = await usedCoupon.updateOne({userId:user},{$push:{userCouponse:{couponId:checkCoupon._id}}});
                    if(updateCoupons){
                        console.log(actualValue);
                     console.log(discountValue);
                    //console.log(appliedCoupon._id)
                    const cart = await Cart.find({user:user});
                    await Cart.updateOne({user:user},{$set:{cartTotal:actualValue,discount:discountValue}});
                    //console.log(updateCartTotal);
                    return res.json({ status: 'success', message: 'Coupon Added', discountValue, actualValue, couponId: checkCoupon._id,applied:true });
                    
                    }
                } else {
                    return res.json({ status: 'added', message: "Coupon Already Used" });
                }
            }
        } else {
            return res.json({ status: 'warning' })
        }

    } catch (err) {
        res.json({ status: 'error' });
        console.log(err)
    }
}

//unlist coupon
const unlistCoupon = async(req,res)=>{
    try{
        const {id} = req.params;
        const coupon = await Coupon.updateOne({_id:id},{$set:{isActive:false}});
        if(coupon){
            res.json({status:'success',message:'Coupon UnListed'})
        }
    }catch(err){
        console.log(err)
    }
}
const listCoupon =async(req,res)=>{
    try{
        const {id} = req.params;
        const coupon = await Coupon.updateOne({_id:id},{$set:{isActive:true}});
        if(coupon){
            res.json({status:'success',message:'Coupon Listed'})
        }
    }catch(err){
        console.log(err)
    }
}
//Delete Coupon
const deleteCoupon = async(req,res)=>{
    try{
        const {id}=req.params
        const deleteCoupon = await Coupon.deleteOne({_id:id});
        if(deleteCoupon){
            res.json({status:'success',message:'Coupon Deleted Successfully'});
        }
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    loadCoupons,
    loadAddCoupons,
    addCoupon,
    applyCoupon,
    unlistCoupon,
    listCoupon,
    deleteCoupon
}