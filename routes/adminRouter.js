const express = require('express');
const sessions = require('express-session');
const morgan = require('morgan');
const nocache = require('nocache');
const bodyparser = require('body-parser');
const path = require('path')
const app = express();
const hbs = require('express-handlebars')
const multer = require('multer');

const hbsHelper = require('../helper/handlebarHelpers')
hbsHelper.chekEqual()
hbsHelper.chekGreater()
hbsHelper.chekLess()
hbsHelper.looping()
hbsHelper.formatDate();


const {fileStorageEngine} = require('../middlewares/multer');
const {bannerFileStorageEngine} = require('../middlewares/multer');
const auth = require('../middlewares/adminAuth');
const adminController = require('../controller/adminContoller')
const {Store} = require('../config/dbsession')
app.use(nocache())
app.use(sessions({
    secret:'secretmessages',
    resave:false,
    saveUninitialized:true,
    store:Store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // Session expires after 1 week
    }
}))

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.urlencoded({extended:true}));
// app.use(morgan('dev'));
app.set('view engine','hbs')
app.set('views','./views/partials/admin');
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'adminlayout',
    layoutsDir: './views/layouts/',
    partialsDir:'./views/partials/'
}));

app.get('/',auth.isLogout, adminController.loadLogin)
app.get('/login',auth.isLogout, adminController.loadLogin)
app.post('/login',adminController.verifyAdmin)
app.get('/dashboard',auth.isLogin,adminController.loadDashboard)
app.get('/users',auth.isLogin,adminController.loadUsers);

//Block user and Unblock user -USER
app.get('/users/block_user/:id',auth.isLogin,adminController.blockUser)
app.get('/users/unblock_user/:id',auth.isLogin,adminController.unblockUser);

//Products management
const productController = require('../controller/productController')
app.get('/products',auth.isLogin,productController.loadProducts);
app.get('/products/add_product',auth.isLogin,productController.loadAddProduct)
const upload=multer({storage:fileStorageEngine})
app.post('/products/add_products',upload.array('images',3),auth.isLogin,productController.insertProduct)
app.get('/products/edit_product/:id',auth.isLogin,productController.loadEditProduct)
app.post('/products/edit_product/:id',upload.array('images',3),auth.isLogin,productController.editProduct)
app.get('/products/:id',auth.isLogin,productController.loadDeleteProduct)
app.post('/products/delete_product/:id',auth.isLogin,productController.deleteProduct)


//Category management
const categoryController = require('../controller/categoryContoller')
app.get('/category',auth.isLogin,categoryController.loadCategory)
app.post('/category/add_category',auth.isLogin,categoryController.insertCategory);
app.get('/category/:id',auth.isLogin,categoryController.loadEditCategory)
app.post('/category/edit_category/:id',auth.isLogin,categoryController.editCategory);
app.get('/category/delete_category/:id',auth.isLogin,categoryController.loadDeleteCategory);
app.post('/category/delete_category/:id',auth.isLogin,categoryController.deleteCategory);


//Order management
const orderController = require('../controller/orderController');
app.get('/orders',auth.isLogin,orderController.loadOrders);
app.post('/orders/update_status/:id',auth.isLogin,orderController.updateStatus);
app.get('/orders/details/:id',auth.isLogin,orderController.loadSingleOrderDetails);
app.post('/orders/approve_return/:id',auth.isLogin,orderController.approveReturnRequest);

//Coupon management
const couponController = require('../controller/couponController');
app.get('/coupons',auth.isLogin,couponController.loadCoupons);
app.get('/coupons/add_coupon',auth.isLogin,couponController.loadAddCoupons);
app.post('/coupons/add_coupon',auth.isLogin,couponController.addCoupon);
app.get('/coupons/unlist/:id',auth.isLogin,couponController.unlistCoupon);
app.get('/coupons/list/:id',auth.isLogin,couponController.listCoupon);
app.delete('/coupons/delete/:id',auth.isLogin,couponController.deleteCoupon);

//Deal of month
const dealOfController = require('../controller/dealOfController');
app.get('/deal_of_month',auth.isLogin,dealOfController.loadDealOfMonth);
app.post('/deal_of_month/add',auth.isLogin,dealOfController.addNewDeal);

//sales report
app.get('/sales_report',auth.isLogin,adminController.loadSalesReport);
app.get('/sales_reports',auth.isLogin,adminController.filterSalesReport);

//Banner managment
const bannerController = require('../controller/bannerController');
app.get('/banners',auth.isLogin,bannerController.loadBanner);
const uploadBanner=multer({storage:bannerFileStorageEngine})
app.post('/banners/add_banner',uploadBanner.single('image'),auth.isLogin,bannerController.addBanner);

//Offer Management
const offerController = require('../controller/offerController');
app.get('/offers',auth.isLogin,offerController.loadOffer);
app.post('/offers/update_offer',auth.isLogin,offerController.udpateOffer);
app.post('/offers/update_category_offer',auth.isLogin,offerController.updateCategoryOffer);

//Contact messages management
const contactController = require('../controller/contactController');
app.get('/contact',auth.isLogin,contactController.loadContactAdmin);



//logout admin
app.get('/logout',auth.isLogin,adminController.logoutAdmin);
module.exports=app
