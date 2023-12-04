const User = require('../model/userModel');
const Product = require('../model/productModel');
const Category = require('../model/categoryModel');
const Cart = require('../model/cartModel');

const loadShop = async (req, res) => {
    try {

        let page = parseInt(req.query.page) || 1
        let search = req.query.search || ""
        let category = req.query.category || "Allcategories"
        let filter = req.query.filter

        if (filter == "L2H") {
            filter = 1
        } else if (filter == 'H2L') {
            filter = -1
        } else {
            filter = false
        }

        const categories = await Category.find();
        const categoriesData = categories.map(item => ({
            ...item.toObject(),
            // Add properties as "own properties" as needed
            ownProperty: item.mobile,
        }));

        let size = 8
        const skip = (page - 1) * size

        const totalCount = await Product.countDocuments({});
        //console.log(totalCount)
        if (category == "Allcategories") {
            category = false
            var rawData = await Product.find({ name: { $regex: search, $options: "i" } }).limit(size).skip(skip)
            var count = await Product.countDocuments({ name: { $regex: search, $options: "i" } }, { limit: size, skip: skip })
            if (filter !== false) {

                var rawData = await Product.find({ name: { $regex: search, $options: "i" } }).limit(size).skip(skip).sort({ offerprice: filter })
                //var count = await Product.countDocuments({name:{$regex:search,$options:"i"}},{limit:size,skip:skip})

            }
        } else {
            var count = await Product.countDocuments({ name: { $regex: search, $options: "i" }, category: category }, { limit: size, skip: skip })
            var rawData = await Product.find({ name: { $regex: search, $options: "i" }, category: category }).limit(size).skip(skip)
            if (filter !== false) {

                var rawData = await Product.find({ name: { $regex: search, $options: "i" }, category: category }).limit(size).skip(skip).sort({ offerprice: filter })
                //var count = await Product.countDocuments({name:{$regex:search,$options:"i"}},{limit:size,skip:skip})

            }
        }



        // const count = await Product.countDocuments({name:{$regex:search,$options:"i"}},{limit:size,skip:skip})
        const processedData = rawData.map(item => ({
            ...item.toObject(),
            // Add properties as "own properties" as needed
            ownProperty: item.mobile,
        }));



        if (page == 1) {
            var p1 = true
        } else if (page == 2) {
            var p2 = true
        } else if (page == 3) {
            var p3 = true
        }
        if (count == 0) {
            var errMsg = 'Sorry, No more results found.!'
        }
        //  if(count<10){
        //     var two = true
        // }else if(count<15){
        //     var two = true
        //     var three = true
        // }

        if (filter == 1) {
            filter = "L2H"
        } else if (filter == -1) {
            filter = "H2L"
        }

        if (req.session.isAuthUser) {
            const user = await Cart.findOne({ user: req.session.isAuthUser });
            if(user){
                var cartItemsCount = user.cartItems.reduce((acc, product) => {
                    return acc += product.quantity;
                }, 0)
            }
            if (cartItemsCount == 0) {
                cartItemsCount = false;
            }
            return res.render('shop', { verified: true, getAllProducts: processedData, p1, p2, p3, search, errMsg, categoriesData: categoriesData, category, filter, cartItemsCount,count,totalCount });
        }
        res.render('shop', { getAllProducts: processedData, p1, p2, p3, search, errMsg, categoriesData: categoriesData, category, filter,count,totalCount });
    } catch (err) {
        throw new Error(err)
    }

}

const wishListOperation = async (req, res) => {
    try {
        const id = req.body.productId;
        const check = await Product.findOne({ _id: id });
        if (check.wishlist == true) {
            res.send('already addedd')
        } else {
            const updateProduct = await Product.updateOne({ _id: id }, { $set: { wishlist: true } });
            if (updateProduct) {
                res.status(200).send('Item added to wishlist')
            }
        }


    } catch (err) {
        throw new Error(err)
    }
}
const deleteWishlist = async (req, res) => {
    try {
        const id = req.body.productId;
        const updateProduct = await Product.updateOne({ _id: id }, { $set: { wishlist: false } });
        if (updateProduct) {
            res.status(200).send('Item removed from wishlist')

        }
    } catch (err) {
        throw new Error(err)
    }
}



module.exports = {
    loadShop,
    wishListOperation,
    deleteWishlist,
}