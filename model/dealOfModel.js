const mongoose = require('mongoose');
const dealOfMonth = new mongoose.Schema({
    productName:{
        type:String,
        ref:'Product',
        required:true,
    },
    offer:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('DealOfMonth',dealOfMonth)