const User = require('../model/userModel');
const handlebars = require('handlebars');
const Product = require('../model/productModel');
const Admin = require('../model/adminModel');
const Order = require('../model/orderModel');
const Category = require('../model/categoryModel');
const { ObjectId } = require('mongodb');

const loadLogin = async (req, res) => {
    const invalid = req.query.invalid
    if (invalid) {
        return res.render('login', { invalid });
    }
    res.render('login');
}
//POST method for admin login

const verifyAdmin = async (req, res) => {
    const { username, password } = req.body
    console.log(username, password);
    try {
        const checkAdmin = await Admin.findOne({ $and: [{ username: username }, { password: password }] })
        if (checkAdmin) {
            req.session.isAuthAdmin = checkAdmin._id
            res.redirect('/admin/dashboard')
        } else {
            const invalid = true
            return res.redirect(`/admin?invalid=${invalid}`);
        }
    } catch (err) {
        throw new Error(err)
    }
}

const loadUsers = async (req, res) => {
    try {
        const searchData = req.query.user ||'' 
        const page = req.query.page || 1
        let size = 10
        const skip = (page - 1) * size

        const rawData = await User.find({ $and: [{ is_admin: 0 }, { verified: true },{ name: { $regex: searchData, $options: "i" }}] }).limit(size).skip(skip)
        let count = await User.countDocuments({ $and: [{ is_admin: 0 }, { verified: true },{ name: { $regex: searchData, $options: "i" }}] }).limit(size).skip(skip)
        let total = await User.countDocuments({ $and: [{ is_admin: 0 }, { verified: true },{ name: { $regex: searchData, $options: "i" }}] })
        
        if(count===0){
            var countIsZero=true
        }
        
        var processedData = rawData.map(item => ({
            ...item.toObject(),
            // Add properties as "own properties" as needed
            ownProperty: item.mobile,
        }));
        
        const blocked = req.query.blocked
        const unblocked = req.query.unblocked
        const dateFromMongo = new Date();
        const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateFromMongo);
        
        
        res.render('users', { data: processedData,searchData,count,countIsZero,total });
    } catch (err) {
        //res.render('error');
        console.log(err)
    }
}
//get method for block a user
const blockUser = async (req, res) => {
    try {
        const { id } = req.params
        //console.log(id)

        const block = await User.updateOne({ _id: new ObjectId(id) }, { $set: { is_blocked: true } });
        if (block) {
            
             return  res.render('users',{is_blocked:true})
        }else{
            console.log('yrddd')
            res.json({status:'error'});
        }
        res.render('users')
    } catch (err) {
        throw new Error(err)
    }
}

const unblockUser = async (req, res) => {
    try {
        const { id } = req.params
        const block = await User.updateOne({ _id:id}, { $set: { is_blocked: false } });
        if (block) {
            res.render('users',{is_blocked:false})
        }else{
            res.json({status:'error'});
        }

    } catch (err) {
        throw new Error(err)
    }
}

//logout admin
const logoutAdmin = async (req, res) => {
    try {
        req.session.isAuthAdmin = false
        res.redirect('/admin');
    } catch (err) {
        throw new Error(err)
    }
}

const loadDashboard = async (req, res) => {
    try {
        const orders = await Order.find()
        const pendingItemCount = await Order.countDocuments({ orderStatus: 'Pending' });
        const deliveredItemCount = await Order.countDocuments({ orderStatus: 'Delivered' });
        const placedItemCount = await Order.countDocuments({ orderStatus: 'Placed' });
        const CancelledItemCount = await Order.countDocuments({ orderStatus: 'Cancel' });
        const shippedCount = await Order.countDocuments({ orderStatus: 'Shipped' });
        const category = await Category.find();
        var catCount = []
        var catName = []
        category.forEach(async (item) => {

            const countCategory = await Product.countDocuments({ category: item.name })
            catCount.push(countCategory);
            catName.push(String(item.name));
            //console.log(catName)
            //console.log(item.name+": "+countCategory);
        })

        const processedData = catName.map(item => ({
            ...item.toObject(),
            // Add properties as "own properties" as needed
            ownProperty: item.mobile,
        }));

        
        // Finding the total revenue

        let to = orders.reduce((acc, order) => {
            return acc += order.products.reduce((acc, product) => {
                if (product.productStatus !== 'Returned') {
                    return acc += product.total;
                }
                return acc;
            }, 0);
        }, 0);

        let totalRevenue = orders.reduce((acc, order) => {
            if(order.orderStatus!=='Returned' && order.orderStatus!=='Cancel'){
                return acc+=order.totalAmount
            }
            return acc;
        }, 0);
        let codRevenue = orders.reduce((acc, order) => {
            if(order.orderStatus!=='Returned' && order.orderStatus!=='Cancel'){
                if(order.paymentMethod=='COD'){
                    return acc+=order.totalAmount
                }
                return acc
            }
            return acc;
        }, 0);
        

        let onlineRevenue = orders.reduce((acc, order) => {
            if(order.paymentMethod!=='COD'){
                return acc+=order.totalAmount
            }
            return acc
        }, 0);

        //console.log(codRevenue)
        //console.log(onlineRevenue);
        //console.log(codRevenue+onlineRevenue)

        const locale = 'en-IN'; // Indian English locale
        const formattedNumber = totalRevenue.toLocaleString(locale);
        codRevenue = codRevenue.toLocaleString(locale)
        let ordersCount = orders.length
        let categoryTotal = category.length
        const products = await Product.find();
        let productTotal = products.length
        //console.log(productTotal)
        //const  = await Order.countDocuments({orderStatus:'Pending'});
        res.render('dashboards', {processedData, pendingItemCount, deliveredItemCount, placedItemCount, CancelledItemCount, catCount, catName, shippedCount, formattedNumber, ordersCount, productTotal, categoryTotal,codRevenue,onlineRevenue });
    } catch (err) {
        throw new Error(err)
    }
}

//load sales Report
const loadSalesReport = async(req,res)=>{
    try{
        //const orders = await Order.aggregate([{$match:{orderStatus:'Delivered'}},{$sort:{orderDate:-1}}])
        const orders = await Order.find({orderStatus:'Delivered'}).sort({orderDate:-1}).populate('user').populate('products.productId');
        const processedData = orders.map(item => ({
            ...item.toObject(),
            // Add properties as "own properties" as needed
            ownProperty: item.mobile,
        }));
        //console.log(orders.user)
        res.render('sales-report',{orders:processedData});
        
    }catch(err){
        throw new Error(err)
    }
}

const filterSalesReport = async(req,res)=>{
    try{
        const date = req.query.date;
        //console.log(date)
        let orders;
        var selected
        const currentDate = new Date()

        //helper functions
        function getFirstDayOfMonth(date){
            return new Date(date.getFullYear(), date.getMonth(),1)
        }
        function getFirstDayOfYear(date) {
            return new Date(date.getFullYear(), 0, 1);
        }

        switch (date) {
            case 'today':
                selected='today'
                orders = await Order.find({
                    orderStatus: 'Delivered',
                    orderDate: {
                        $gte: new Date().setHours(0, 0, 0, 0), // Start of today
                        $lt: new Date().setHours(23, 59, 59, 999), // End of today
                    },
                }).populate('user');
                break;
             case 'week':
                selected='week'
                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Set to the first day of the week (Sunday)
                startOfWeek.setHours(0, 0, 0, 0);

                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to the last day of the week (Saturday)
                endOfWeek.setHours(23, 59, 59, 999);

                orders = await Order.find({
                    orderStatus: 'Delivered',
                    orderDate: {
                        $gte: startOfWeek,
                        $lt: endOfWeek,
                    },
                }).populate('user');
                break;
            case 'month':
                selected='month'
                const startOfMonth = getFirstDayOfMonth(currentDate);
                const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

                orders = await Order.find({
                    orderStatus: 'Delivered',
                    orderDate: {
                        $gte: startOfMonth,
                        $lt: endOfMonth,
                    },
                }).populate('user');
                break;
            case 'year':
                selected='year'
                const startOfYear = getFirstDayOfYear(currentDate);
                const endOfYear = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59, 999);

                orders = await Order.find({
                    orderStatus: 'Delivered',
                    orderDate: {
                        $gte: startOfYear,
                        $lt: endOfYear,
                    },
                }).populate('user');
               
                break;
            default:
                // Fetch all orders
                orders = await Order.find({ orderStatus: 'Delivered' });
        }
        //console.log(orders);
        const processedData = orders.map(item => ({
            ...item.toObject(),
            // Add properties as "own properties" as needed
            ownProperty: item.mobile,
        }));

        res.render('sales-report',{orders:processedData,selected});
    }catch(err){
        console.log(err)
    }
}


module.exports = {
    loadLogin,
    verifyAdmin,
    loadDashboard,
    loadUsers,
    blockUser,
    unblockUser,
    logoutAdmin,
    loadSalesReport,
    filterSalesReport
}