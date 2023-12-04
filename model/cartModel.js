const mongoose = require('mongoose');
const cartModel = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    cartItems:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            },
            quantity:{type:Number},
            // category:{type:mongoose.Schema.Types.ObjectId},
            total:{type:Number},

        }
    ],
    cartTotal:{type:Number},
    discount:{
        type:Number,
        default:0
    }
})

module.exports = mongoose.model('Cart',cartModel)