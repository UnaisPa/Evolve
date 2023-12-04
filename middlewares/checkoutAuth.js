const Cart = require('../model/cartModel');
const checkCarIsNotEmpty = async (req, res,next) => {
    try {
        const userId = req.session.isAuthUser
        const cart = await Cart.findOne({user:userId});
        const cartItemsCount = cart.cartItems.reduce((acc, product) => {
            return acc += product.quantity;
        }, 0)
        if (cartItemsCount === 0) {
            res.redirect('/cart')
        }else{
            next()
        }

    } catch (err) {
        throw new Error(err)
    }
}
module.exports = {checkCarIsNotEmpty}