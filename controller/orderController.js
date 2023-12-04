const User = require('../model/userModel');
const Address = require('../model/addressModel');
const Cart = require('../model/cartModel');
const Order = require('../model/orderModel');
const Wallet = require('../model/walletModel');
const razorpayHelper = require('../helper/razorpayHelper');
const easyinvoice = require('easyinvoice');
const fs = require('fs');
const { Readable } = require('stream');
const placeOrder = async (req, res) => {
    try {
        const userId = req.session.isAuthUser
        const userCart = await Cart.findOne({ user: userId }).populate('cartItems.productId')
        const { totalPrice, paymentMethod, addressId, discount } = req.body;
        console.log(discount)

        const cartProducts = userCart.cartItems
        //console.log(cartProducts)
        let orderedProducts = []
        cartProducts.forEach(product => {
            const products = {
                productId: product.productId._id,
                quantity: product.quantity,
                offerPrice: product.productId.offerprice,
                total: product.total,
                productStatus: 'Placed',

            }

            orderedProducts.push(products);
        });

        const userAddress = await Address.findOne({ user: userId });
        const shipAddress = userAddress.address.find(address => address._id.toString() === addressId);

        const address = {
            name: shipAddress.name,
            mobile: shipAddress.mobile,
            pincode: shipAddress.pincode,
            city: shipAddress.city,
            district: shipAddress.district,
            state: shipAddress.state,
            address: shipAddress.address
        }

        const createOrderDetails = new Order({
            user: userId,
            discount: discount,
            totalAmount: totalPrice,
            paymentMethod: paymentMethod,
            products: orderedProducts,
            address: address,
        })
        const placeOrder = await createOrderDetails.save()

        // payment methods

        //1.COD
        if (placeOrder.paymentMethod === 'COD') {
            placeOrder.orderStatus = 'Placed';
            await placeOrder.save();

            // reduce the products quantity
            const userCartProducts = userCart.cartItems
            userCartProducts.forEach(async (product) => {
                product.productId.quantity -= product.quantity;
                await product.productId.save()
            })
            //console.log(cartProducts.productId.quantity)
            if (userCart) {
                userCart.cartItems = [];
                await userCart.save();
            }
            res.json({ status: 'COD', placeOrderId: placeOrder._id })

        } else if (placeOrder.paymentMethod == 'Razorpay') {
            const orderId = placeOrder._id;
            const total = placeOrder.totalAmount;

            razorpayHelper.generateRazorPay(orderId, total).then((response) => {
                res.json({ status: 'Razorpay', response })
            })
            // reduce the products quantity
            const userCartProducts = userCart.cartItems
            userCartProducts.forEach(async (product) => {
                product.productId.quantity -= product.quantity;
                await product.productId.save()
            })
            //console.log(cartProducts.productId.quantity)
            if (userCart) {
                userCart.cartItems = [];
                await userCart.save();
            }
            //Wallet
        } else if (placeOrder.paymentMethod=='Wallet'){
            let userWallet = await Wallet.findOne({userId:userId});
            if(!userWallet){
                userWallet = new Wallet({userId:userId});
                await userWallet.save()
            }

            const walletAmount = userWallet.walletAmount
            if(walletAmount){
                userWallet.walletAmount=walletAmount-totalPrice
                const amount = -1*totalPrice
                userWallet.walletHistory.push({amount:amount,date:new Date(),type:'Purchased'})
                await userWallet.save();
                placeOrder.orderStatus='Placed'
                await placeOrder.save()
                
                // reduce the products quantity
                const userCartProducts = userCart.cartItems
                userCartProducts.forEach(async (product) => {
                    product.productId.quantity -= product.quantity;
                    await product.productId.save()
                })
                if (userCart) {
                    userCart.cartItems = [];
                    await userCart.save();
                }

                return res.json({status:'Wallet', placeOrderId: placeOrder._id});
            }
            
        }

    } catch (err) {
        throw new Error(err)
    }
}

const verifyOnlinePayment = async (req, res) => {
    const userId = req.session.isAuthUser
    const data = req.body
    let receiptId = data.order.receipt;
    console.log('resipt:', receiptId);
    razorpayHelper.verifyPayment(data).then(async () => {
        console.log('Success');

        if (data.from=='wallet') {
            const amount = (data.order.amount)/100;
            Wallet.findOneAndUpdate({userId:userId},{$inc:{walletAmount:amount},$push:{walletHistory:{amount:amount,date:new Date(),type:'Recharged'}}},{new:true})
            .then((updatedWallet)=>{
               console.log('Wallet Updated :',updatedWallet)
               res.json({status:'rechargeSuccess',message:'Wallet Updated'});
            })
            .catch(()=>{
               console.log('Wallet Not updated');
               res.json({status:'error',message:'Wallet Not Updated'});
            })
        } else {
            await Order.findByIdAndUpdate({ _id: new Object(receiptId) }, { $set: { orderStatus: 'Placed' } });
            res.json({ status: 'payment success', placeOrderId: receiptId })
        }
    }).catch(async (err) => {
        console.log('Error occured', err);
        if (err) {
            await Order.findByIdAndUpdate({ _id: new Object(receiptId) }, { $set: { orderStatus: 'Cancelled' } });
            res.json({ status: 'payment failed', placeOrderId: receiptId })
        }
    })
}

const loadConfirmation = async (req, res) => {
    try {
        const orderId = req.query.orderId
        const userId = req.session.isAuthUser

        if (orderId) {
            const orderDetails = await Order.findById(orderId).populate('products.productId');
            const products = orderDetails.products
            const processedData = products.map(item => ({
                ...item.toObject(),
                // Add properties as "own properties" as needed
                ownProperty: item.mobile,
            }));
            const user = await User.findOne({ _id: userId });
            const dateFromMongo = new Date(orderDetails.orderDate);

            const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
            const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateFromMongo);

            res.render('confirmation', { verified: true, products: processedData, username: user.name, orderDate: formattedDate, orderDetails })
        } else {
            res.redirect('/')
        }
    } catch (err) {
        throw new Error(err)
    }
}

const invoice = async (req, res) => {
    const { orderId } = req.params
    console.log(orderId);
    const orderDetails = await Order.findById(orderId).populate([
        {
            path: 'user'
        },
        {
            path: 'products.productId'
        }
    ]);
    console.log(orderDetails.discount + " " + orderDetails.totalAmount);
    const products = orderDetails.products.map((item) => ({
        price: item.offerPrice,
        quantity: item.quantity,
        description: item.productId.name,
        total: item.offerPrice * item.quantity - (item.offerPrice * item.quantity * orderDetails.discount) / 100,
        "tax-rate": 0,

    }));
    products.push({
        price: 0 - (orderDetails.discount), // The discount price (assuming it's a percentage)
        quantity: 1, // Assuming it's a one-time discount
        description: "Discount", // Description for the discount line
        total: orderDetails.discount, // Subtract the discount from the total
        "tax-rate": 0,
    });

    const dateToString = orderDetails.orderDate
    const isDate = new Date(dateToString);

    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = isDate.toLocaleDateString("en-US", options);

    //invoice data
    const data = {
        customize: {
            //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html
        },
        images: {
            // The invoice background
            background: "",
        },
        // Your own data
        sender: {
            company: "Evolve",
            address: "Bangalore GK nagar 432",
            city: "Bangalore",
            country: "India",
        },
        client: {
            company: "Customer Address",
            "zip": orderDetails.address.pincode,
            "city": orderDetails.address.city,
            "address": orderDetails.address.address + ' ' + orderDetails.address.state,
            // "custom1": "custom value 1",
            // "custom2": "custom value 2",
            // "custom3": "custom value 3"
        },
        information: {
            // Invoice number
            number: orderDetails._id,
            // ordered date
            date: formattedDate,
        },
        products: products,
        "bottom-notice": `Thanks for shopping with Evolve.`,
    };
    const pdfResult = await easyinvoice.createInvoice(data);
    const pdfBuffer = Buffer.from(pdfResult.pdf, "base64");

    res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"');
    res.setHeader("Content-Type", "application/pdf");

    // Create a readable stream from the PDF buffer and pipe it to the response
    const pdfStream = new Readable();
    pdfStream.push(pdfBuffer);
    // console.log(pdfStream)

    pdfStream.push(null);
    //  console.log(pdfStream)

    pdfStream.pipe(res);

}

const loadOrderHistory = async (req, res) => {
    try {
        const userId = req.session.isAuthUser
        const orderDetails = await Order.find({ user: userId }).populate('products.productId');
        const count = await Order.countDocuments({ user: userId }).populate('products.productId')
        console.log(count);
        const products = orderDetails.products
        const processedData = orderDetails.map(item => ({
            ...item.toObject(),

            // Add properties as "own properties" as needed
            ownProperty: item.mobile,

        }));
        // const date = []
        orderDetails.forEach(async (order) => {
            const dateFromMongo = new Date(order.orderDate);

            const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
            const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateFromMongo);
            //order.orderDate=formattedDate;
            await Order.updateOne({ order: order.order }, { $set: { foramttedDate: formattedDate } })
            //console.log(order.foramttedDate);
        });
        // const user = await User.findOne({ _id: userId });
        // const dateFromMongo = new Date(orderDetails.orderDate);

        // const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
        // const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateFromMongo);

        res.render('orderHistory', { verified: true, orderDetails: processedData,count })
    } catch (err) {
        throw new Error(err)
    }
}

const loadOrderDetails = async (req, res) => {
    try {
        const orderId = req.query.orderId
        const userId = req.session.isAuthUser

        if (orderId) {
            const orderDetails = await Order.findById(orderId).populate('products.productId');
            const products = orderDetails.products
            const processedData = products.map(item => ({
                ...item.toObject(),
                // Add properties as "own properties" as needed
                ownProperty: item.mobile,
            }));
            const user = await User.findOne({ _id: userId });
            const dateFromMongo = new Date(orderDetails.orderDate);

            const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
            const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateFromMongo);



            res.render('orderDetails', { verified: true, products: processedData, username: user.name, orderDate: formattedDate, orderDetails })
        }
    } catch (err) {
        throw new Error(err)
    }
}

//cancel order
const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params
        const checkIfCancelled = await Order.findById(id);
        if (checkIfCancelled.orderStatus == 'Cancelled') {
            return res.json({ status: 'warning', message: 'Order already Cancelled' });
        }
        const orderDetails = await Order.findByIdAndUpdate(id, { $set: { orderStatus: 'Cancel' } }, { new: true }).populate('products.productId')
        if (orderDetails.paymentMethod !== 'COD') {
            //wallet operations
            let userWallet = await Wallet.findOne({userId:req.session.isAuthUser});
            if(!userWallet){
                userWallet = new Wallet({userId:req.session.isAuthUser});
                await userWallet.save();
            }
            const amount = orderDetails.totalAmount
            
            await Wallet.findOneAndUpdate({userId:req.session.isAuthUser},{$inc:{walletAmount:amount},$push:{walletHistory:{amount:amount,date:new Date(),type:'Recharged'}}},{new:true})
            console.log('heloo');
        }
        //restock 
        orderDetails.products.forEach((product) => {
            product.productId.quantity += product.quantity
        })
        await orderDetails.save()
        res.json({ status: 'success', message: 'Order Cancelled Successfully' })
    } catch (err) {
        res.json({ status: 'error', message: 'An error occured' });
        throw new Error(err)
    }
}

//Return Order
const returnOrder = async(req,res)=>{
    try{
        const { id } = req.params;
        const orderDetails = await Order.findByIdAndUpdate(id, { $set: { returnOrderStatus:'requested' } }, { new: true }).populate('products.productId');
        if(orderDetails){
            res.json({status:'success',message:'Return Request send'});
        }
    }catch(err){
        console.log(err)
    }
}

//Admin side order management
const loadOrders = async (req, res) => {
    try {
        const itemsPerPage = 15
        const page = parseInt(req.query.page) || 1;
        const totalOrders = await Order.countDocuments();
        const totalPages = Math.ceil(totalOrders / itemsPerPage);

        const userId = req.session.isAuthUser
        const orderDetails = await Order.find()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .populate('products.productId')
            .populate('user');

        const products = orderDetails.products
        const processedData = orderDetails.map(item => ({
            ...item.toObject(),

            // Add properties as "own properties" as needed
            ownProperty: item.mobile,

        }));
        orderDetails.forEach(async (order) => {
            const dateFromMongo = new Date(order.orderDate);

            const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
            const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateFromMongo);
            //order.orderDate=formattedDate;
            await Order.updateOne({ order: order.order }, { $set: { foramttedDate: formattedDate } })

        });

        res.render('orders', { orders: processedData, currentPage: page, totalPages: totalPages, itemsPerPage, totalOrders })
    } catch (err) {
        throw new Error(err)
    }
}

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params
        const newStatus = req.body.newStatus
        const currentPage = req.body.currentPage
        const updateStatus = await Order.updateOne({ _id: id }, { $set: { orderStatus: newStatus } });
        if (updateStatus) {
            res.redirect(`/admin/orders?currentPage=${currentPage}`);
        }


    } catch (err) {
        throw new Error(err)
    }
}

const loadSingleOrderDetails = async (req, res) => {
    try {
        const { id } = req.params
        const getOrderDetails = await Order.findById(id).populate('products.productId').populate('user');
        const products = getOrderDetails.products
        const processedData = products.map(item => ({
            ...item.toObject(),
            // Add properties as "own properties" as needed
            ownProperty: item.mobile,
        }));
        const user = getOrderDetails.user
        const dateFromMongo = new Date(getOrderDetails.orderDate);
        const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateFromMongo);
        res.render('orderDetails', { products: processedData, orderDetails: getOrderDetails, formattedDate, user })

    } catch (err) {
        throw new Error(err)
    }
}

//approve return request
const approveReturnRequest = async(req,res)=>{
    try{
        const {id} = req.params
        const orderDetails = await Order.findByIdAndUpdate(id, { $set: { returnOrderStatus:'request approved' } }, { new: true }).populate('products.productId');
        if (orderDetails.paymentMethod !== 'COD') {
            //wallet operations
            let userWallet = await Wallet.findOne({userId:req.session.isAuthUser});
            if(!userWallet){
                userWallet = new Wallet({userId:req.session.isAuthUser});
                await userWallet.save();
            }
            const amount = orderDetails.totalAmount
            
            await Wallet.findOneAndUpdate({userId:req.session.isAuthUser},{$inc:{walletAmount:amount},$push:{walletHistory:{amount:amount,date:new Date(),type:'Recharged'}}},{new:true})
            console.log('heloo');
        }
        //restock 
        orderDetails.products.forEach((product) => {
            product.productId.quantity += product.quantity
        })

        res.json({status:'success',message:'Return request Approved'});
        
    }catch(err){
        console.log(err)
    }
}


module.exports = {
    placeOrder,
    verifyOnlinePayment,
    loadConfirmation,
    loadOrderHistory,
    loadOrderDetails,
    cancelOrder,
    returnOrder,
    invoice,

    //Admin
    loadOrders,
    updateStatus,
    loadSingleOrderDetails,
    approveReturnRequest
}