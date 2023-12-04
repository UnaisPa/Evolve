const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    order: {
        type: String,
        default: () => {
            return Math.floor(100000 + Math.random() * 900000).toString();
        }
    }, 
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'UserData'
    },
    discount:{
        type:Number,
        default:0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String
    },
    products: [{
        productId: {
            type: mongoose.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
        },
        offerPrice: {
            type: Number,
        },
        total: {
            type: Number,
        },
        productStatus: {
            type: String,
            default: 'Pending'
        }
    }],
    address: {
        name: {
            type: String,
            required: true,
        },
        mobile: {
            type: Number,
            required: true,
        },
        pincode: {
            type: Number,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    },
    orderDate:{
        type:Date,
        default: new Date()
    },
    foramttedDate:{
        type:String,
        default:''
    },
    orderStatus: {
        type: String,
        default: 'Pending',
    },
    returnOrderStatus: {
        type: String,
        default: 'Not requested'
        
    },
    deliveredDate: {
        type: Date,
        default: '',
    }
})

module.exports = mongoose.model('Order',orderSchema)