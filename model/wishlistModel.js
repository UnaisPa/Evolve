const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    wishlistItems:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            },
            createdAt:{
                type:Date,
                default:new Date()
            }
        }
    ]

})
module.exports = mongoose.model('Wishlist',wishlistSchema);