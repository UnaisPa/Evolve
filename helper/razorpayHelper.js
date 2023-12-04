const Razorpay = require('razorpay');
const Order = require('../model/orderModel');
const Crypto = require('crypto');

var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_ID,
});

const generateRazorPay = async (orderId, total) => {
    return new Promise((resolve, reject) => {
        var options = {
            amount: total * 100, // INR
            currency: "INR",
            receipt: orderId,
        };
        instance.orders.create(options, function (err, order) {
            console.log("New order from razorpay :", order);
            resolve(order)
        });
    })
}

const verifyPayment = async(details)=>{
    return new Promise((resolve,reject)=>{
        let hmac = Crypto.createHmac('sha256',process.env.RAZORPAY_SECRET_ID);
        hmac.update(details.payment.razorpay_order_id+'|'+details.payment.razorpay_payment_id);
        hmac = hmac.digest('hex');
        if(hmac == details.payment.razorpay_signature){
            // If it matches we resolve it 
            resolve();
         }else{
            // Doesn't match we reject
            reject();
         }
    })
}
module.exports = {generateRazorPay,verifyPayment}