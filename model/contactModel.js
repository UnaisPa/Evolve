const mongoose = require('mongoose');
const contactSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    subject:{
        type:String,
        default:'none'
    },
    message:{
        type:String,
        required:true
    },
    createAt:{
        type:Date,
        default: new Date()
    }
})

module.exports = mongoose.model('Contact',contactSchema);