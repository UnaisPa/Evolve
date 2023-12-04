const Cart = require('../model/cartModel');
const User = require('../model/userModel');
const Product = require('../model/productModel');

const addToCart = async(productId,userId)=>{
    const product = await Product.findOne({_id:productId});
    const productObj = {
        productId:productId,
        quantity:1,
        total:product.price,
        category:product.category
    }

    
}