const mongoose = require('mongoose');
const walletSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    walletAmount:{
        type:Number,
        default:0
    },
    walletHistory:{
        type:Array
    }
})

module.exports = new mongoose.model('Wallet',walletSchema);