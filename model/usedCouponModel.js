const mongoose = require('mongoose')
const usedCouponSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    userCouponse: [
        {
            couponId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Coupon',
                required: true
            }
        }
    ] 
}) 

module.exports = mongoose.model('usedCoupons',usedCouponSchema);