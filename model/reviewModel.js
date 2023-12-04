const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    product:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    review:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    },
    created:{
        type:Date,
        default:new Date()
    },
    formattedDate:{
        type:String,
        default:new Date()
    }
})

module.exports = mongoose.model('Review',reviewSchema);