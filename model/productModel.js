const mongoose = require('mongoose');

let productModel = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        ref:'category',
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    offerprice:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    color:{
        type:String,
        default:'blue'
    },
    image:[
        {
            type:String,
            required:true
        }
    ],
    description:{
        type:String,
        required:true
    },
    badge:{
        type:String,
        default:null
    },
})

module.exports= mongoose.model('Product',productModel)