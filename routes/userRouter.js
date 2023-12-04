const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const nocache = require('nocache');
const bodyparser = require('body-parser');
const path = require('path')
const app = express();
const hbs = require('express-handlebars')
const handlebars = require('handlebars');
handlebars.registerHelper('eq', function(a, b, options) {
    if (a === b) {
        return options.fn(this);
    }
    return options.inverse(this);
});

const otpAuth = require('../middlewares/otpAuth')
const auth = require('../middlewares/userAuth');
const userController = require('../controller/userController')
const {checkCarIsNotEmpty} = require('../middlewares/checkoutAuth')
const {userStore} = require('../config/dbsession')
app.use(nocache())
app.use(session({
    secret:'secretmessage',
    resave:false,
    saveUninitialized:true,
    store:userStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // Session expires after 1 week
    }
}))


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.set('view engine','hbs')
app.set('views','./views/partials/user');
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'userlayout',
    layoutsDir: './views/layouts/',
    partialsDir:'./views/partials/'
}));

app.get('/',auth.check,otpAuth.isotpVerfied,userController.loadHome)
//home for verified user
app.get('/home',auth.isLogin,userController.loadHomeVerifiedUser)
app.get('/login',auth.isLogout,userController.loadLogin)
app.post('/login',auth.isLogout,userController.checkUser)

//register
app.get('/register',auth.isLogout ,userController.loadRegister)
app.post('/register',auth.isLogout,userController.createUser)

//forgot password
app.get('/forgot_password',auth.isLogout,userController.loadForgot);
app.post('/forgot_password',auth.isLogout,userController.sendOtpForForgotPassword);
app.post('/verify_forgot_otp',auth.isLogout,userController.verifyForgotPasswordOtp);
app.get('/newPassword',auth.isLogout,userController.loadNewPassword);
app.post('/update_password',auth.isLogout,userController.updatePassword);

//otp authentication
app.get('/verify-user/:id',auth.check,userController.loadVerifyUser)
app.post('/verify-user',userController.verifyUser)
app.get('/resendOTP/:id',userController.resendOTP)

//veiw Product
app.get('/product_details/:id',userController.loadViewProduct)

//shop operations
const shopController = require('../controller/shopController');
app.get('/shop',shopController.loadShop);
app.get('/shop/:page',shopController.loadShop);

//wishlist Operations
const wishlistController = require('../controller/wishlistController');
app.get('/wishlist',wishlistController.loadWishlist);
app.post('/add-to-wishlist',wishlistController.addToWishlist);
app.post('/remove_wishlist',wishlistController.removeItem);

//from cart conrroller
const cartController = require('../controller/cartController');
app.get('/cart',cartController.loadCart);
app.post("/add-to-cart",cartController.addToCart);
app.post('/update-quantity',cartController.updateQuantity);
app.post('/remove_item',cartController.removeItem);

app.get('/checkout',auth.isLogin,checkCarIsNotEmpty,cartController.loadCheckout);

//order Operations
const orderController = require('../controller/orderController');
app.post('/place_order',auth.isLogin,orderController.placeOrder);
app.get('/confirmation',auth.isLogin,orderController.loadConfirmation)
app.get('/order_history',auth.isLogin,orderController.loadOrderHistory);
app.get('/order_details',auth.isLogin,orderController.loadOrderDetails);
app.get('/cancel_order/:id',auth.isLogin,orderController.cancelOrder);
app.post('/return_order/:id',auth.isLogin,orderController.returnOrder);
app.post('/verify-payment',auth.isLogin,orderController.verifyOnlinePayment);
app.get('/invoice/:orderId',auth.isLogin,orderController.invoice);

//profile operations
const profileController = require('../controller/profileController'); 
app.get('/profile',auth.isLogin,profileController.loadProfile);
app.post('/logout',auth.isLogin,profileController.logoutUser)
app.post('/profile/add_address',auth.isLogin,profileController.saveAddress);
app.post('/profile/edit_address',auth.isLogin,profileController.editAddress);
app.post('/profile/delete_address',auth.isLogin,profileController.deleteAddress);
app.post('/profile/edit_profile',auth.isLogin,profileController.editProfile);

//coupon appply
const couponController = require('../controller/couponController');
app.get('/apply_coupon',auth.isLogin,couponController.applyCoupon);

//Review operations
const reviewController = require('../controller/reviewController');
app.post('/add_review',auth.isLogin,reviewController.addProductReview);

//Wallet operations
app.get('/wallet',auth.isLogin,userController.loadWallet);
app.post('/recharge_wallet',auth.isLogin,userController.rechargeWallet);

//Contact operations
const contactController = require('../controller/contactController');
app.get('/contact',contactController.loadContactUser);
app.post('/contact/add',auth.isLogin,contactController.addContact);

module.exports = app
