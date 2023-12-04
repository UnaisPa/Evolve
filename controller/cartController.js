const Cart = require('../model/cartModel');
const Product = require('../model/productModel');
const User = require('../model/userModel');
const mongoose = require('mongoose');
const Address = require('../model/addressModel');
const Coupon = require('../model/couponModel');
const Wallet = require('../model/walletModel');

const loadCart = async (req, res) => {
   try {
      if (req.session.isAuthUser) {
         const id = req.session.isAuthUser
         let cart = await Cart.findOne({ user: id }).populate('cartItems.productId');
         if (!cart) {
            cart = new Cart({ user: req.session.isAuthUser, cartItems: [] });
            await cart.save();
         }

         cart.cartTotal = cart.cartItems.reduce((total, items) => {
            return total + items.total;
         }, 0)

         await Cart.updateOne({user:req.session.isAuthUser},{$set:{discount:0}});

         const cartProducts = cart.cartItems
         const cartTotal = cart.cartTotal

         const cartItemsCount = cart.cartItems.reduce((acc, product) => {
            return acc += product.quantity;
         }, 0)
         if (cartItemsCount === 0) {
            var countIsZero = true
         }

         const processedData = cartProducts.map(item => ({
            ...item.toObject(),
            // Add properties as "own properties" as needed
            ownProperty: item.mobile,
         }));
         //console.log(cartProducts);
         return res.render('cart', { verified: true, products: processedData, cartTotal, cartItemsCount, countIsZero });
      }
      res.render('cart', { notLogin: true });
   } catch (err) {
      throw new Error(err)
   }
}

const addToCart = async (req, res) => {
   try {
      if (req.session.isAuthUser) {
         let productId = req.body.productId;
         // console.log(proId)
         let cart = await Cart.findOne({ user: req.session.isAuthUser });
         // console.log(cart);

         if (!cart) {
            let newCart = new Cart({ user: req.session.isAuthUser, cartItems: [] });
            await newCart.save();
            cart = newCart;
         }
         // console.log(cart);
         const product = await Product.findById(productId).lean();
         if (product.quantity === 0) {
            return res.json({ status: 'error', message: 'Out of stock' })
         } else {
            const existingProductIndex = cart.cartItems.findIndex((product) => {
               return product.productId.toString() === productId;
            })

            if (existingProductIndex === -1) {
               const total = product.offerprice;

               cart.cartItems.push({
                  productId: productId,
                  quantity: 1,
                  total: total
               });
            } else {
               if (product.quantity > cart.cartItems[existingProductIndex].quantity) {
                  cart.cartItems[existingProductIndex].quantity += 1;
                  const product = await Product.findById(productId).lean();
                  cart.cartItems[existingProductIndex].total += product.offerprice;
               } else {
                  return res.json({ status: 'outOfStock', message: 'Out of stock' })
               }

            }
            // Calculate the updated total amount for the cart
            cart.cartTotal = cart.cartItems.reduce((total, product) => {
               return total + product.total;
            }, 0);
            // console.log(cart.total);

            await cart.save();
            // console.log(cart);
            if (req.session.isAuthUser) {
               const cartItemsCount = cart.cartItems.reduce((acc, product) => {
                  return acc += product.quantity;
               }, 0)
               return res.json({ status: 'success', cartTotal: cart.total, message: 'Added to Cart', cartItemsCount });
            }
            return res.json({ status: 'success', cartTotal: cart.total, message: 'Added to Cart' });

         }
      }else{
         return res.json({status:'warning',message:'Login Required!'})
      }

   } catch (error) {
      console.log(error.message);
   }
}


const updateQuantity = async (req, res) => {
   try {
      const userId = new mongoose.Types.ObjectId(req.session.isAuthUser);
      const productId = new mongoose.Types.ObjectId(req.body.proId);
      const count = req.body.count;
      const currentValue = req.body.currentValue;
      const product = await Product.findById(productId);
      //console.log(product.quantity);
      if (product.quantity < currentValue) {
         res.json({ status: 'error', message: 'Stock Exceeded' });
      } else {
         const cart = await Cart.findOneAndUpdate(
            {
               user: userId,
               'cartItems.productId': productId
            },
            {
               $inc:
                  { 'cartItems.$.quantity': count }
            },
            { new: true }
         ).populate('cartItems.productId');

         cart.discount=0;
         // Update total 
         const updateProduct = cart.cartItems.find(product => product.productId._id.equals(productId))
         updateProduct.total = updateProduct.productId.offerprice * updateProduct.quantity;
         await cart.save()

         // Finding the cart total items count
         const cartItemsCount = cart.cartItems.reduce((acc, product) => {
            return acc += product.quantity;
         }, 0)

         // find the cart Total Price
         const cartItemsTotal = cart.cartItems.reduce((acc, product) => {
            return acc += product.total;
         }, 0)
         //updatae cartTotal
         await Cart.updateOne({ user: userId }, { $set: { cartTotal: cartItemsTotal } });
         //console.log(cartItemsTotal);

         res.json({ status: 'success', message: 'Quantity Updated', cartItemsCount, cartItemsTotal });
      }

   } catch (error) {
      console.error('Error:', error.message);
      res.json({ status: 'error' });
   }
};

const removeItem = async (req, res) => {
   try {
      const user = req.session.isAuthUser
      const productId = req.body.productId
      //console.log(productId)
      //remove item from cart
      const removeItem = await Cart.findOneAndUpdate({ user: user }, { $pull: { cartItems: { productId: productId } } }, { new: true })
      const cartItemsTotal = removeItem.cartItems.reduce((acc, product) => {
         return acc += product.total;
      }, 0)
      await Cart.updateOne({ user: user }, { $set: { cartTotal: cartItemsTotal } });
      if (removeItem) {
         res.json({ status: 'success', message: 'Product Successfully removed from cart' })
      }
   } catch (err) {
      res.json({ status: 'error', message: 'Something went wrong' });
      throw new Error(err)
   }
}

const loadCheckout = async (req, res) => {
   try {
      const userId = req.session.isAuthUser
      let address = await Address.findOne({ user: userId });

      if (!address) {
         address = new Address({ userId: userId, address: [] });
         await address.save();
      }

      const userAddress = address.address
      //console.log(userAddress.length)
      if (userAddress.length == 0) {
         var noAddress = true
      }
      const processedData = userAddress.map(item => ({
         ...item.toObject(),
         // Add properties as "own properties" as needed
         ownProperty: item.mobile,
      }));
      const cart = await Cart.findOne({ user: userId }).populate('cartItems.productId'); // Taking the product details
      const cartDetails = cart.cartItems;
      // const grandTotal = cart.cartItems.reduce((total, product) => {
      //    return total + product.total;
      // }, 0);
      console.log(cart.cartTotal) ;
      const grandTotal = cart.cartTotal
      const discountVal = cart.discount
      const cartProductDetails = cartDetails.map(item => ({
         ...item.toObject(),
         // Add properties as "own properties" as needed
         ownProperty: item.mobile,
      }));

      let coupons = await Coupon.find();
      let validateCoupon = []
      const result = coupons.forEach((coupon)=>{
         if(coupon.minOrderAmount<=grandTotal && coupon.expiry> new Date() && coupon.isActive){
            validateCoupon.push(coupon);
         }
      })

      //wallet balance
      const wallet = await Wallet.findOne({userId:userId});
      const walletAmount = wallet.walletAmount

      const validCoupons = validateCoupon.map(item => ({
         ...item.toObject(),
         // Add properties as "own properties" as needed
         ownProperty: item.mobile,
      }));
      
      //console.log(grandTotal)
      const user = await Cart.findOne({ user: userId })
      let cartItemsCount = user.cartItems.reduce((acc, product) => {
         return acc += product.quantity;
      }, 0)
      if (cartItemsCount == 0) {
         cartItemsCount = false;
      }
      res.render('checkout', { verified: true, userAddress: processedData, noAddress, cartDetails: cartProductDetails, grandTotal, cartItemsCount, coupons:validCoupons ,discountVal,walletAmount});
   } catch (err) {
      throw new Error(err)
   }
}

module.exports = {
   loadCart,
   addToCart,
   updateQuantity,
   removeItem,
   loadCheckout
}
