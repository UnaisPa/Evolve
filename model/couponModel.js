const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
    couponCode:{
        type:String,
        required:true
    },
    discountPercentage:{
        type:Number,
        required:true
    },
    minOrderAmount:{
        type:Number,
        required:true,
    },
    discountAmount:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    expiry:{
        type:Date,
        required:true
    },
    createdAt:{
        type:Date,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
})

module.exports = mongoose.model('Coupon',couponSchema);