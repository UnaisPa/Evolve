const mongoose = require('mongoose');
const bannerSchema = new mongoose.Schema({
    text:{
        type:String
    },
    heading:{
        type:String
    },
    image:{
        type:String,
        required:true,
    }
})

module.exports= mongoose.model('Banner',bannerSchema);