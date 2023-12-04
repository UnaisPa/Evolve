const { ObjectId } = require('mongodb');
const Product = require('../model/productModel');
const User = require('../model/userModel');
const Wishlist = require('../model/wishlistModel');

const loadWishlist = async (req, res) => {
    try {
        if (req.session.isAuthUser) {
            const id = req.session.isAuthUser
            let wishlist = await Wishlist.findOne({ user: id }).populate('wishlistItems.productId');
            if (!wishlist) {
                wishlist = new Wishlist({ user: req.session.isAuthUser, wishlistItems: [] });
                await wishlist.save();
            }

            const wishlistProducts = wishlist.wishlistItems
            const wishlistItemsCount = wishlist.wishlistItems.reduce((acc, product) => {
                return acc += 1;
            }, 0)
            console.log('total items :' + wishlistItemsCount);


            const processedData = wishlistProducts.map(item => ({
                ...item.toObject(),
                // Add properties as "own properties" as needed
                ownProperty: item.mobile,
            }));
            //console.log(processedData);
            res.render('wishlist', { verified: true, products: processedData, wishlistItemsCount })
        } else {
            res.render('wishlist', { notLogin: true });
        }

    } catch (err) {
        console.log(err)
    }
}

const addToWishlist = async (req, res) => {
    const productId = req.body.productId
    const user = req.session.isAuthUser
    console.log(productId);
    

    try {
        if (req.session.isAuthUser) {
            const check = await Wishlist.findOne({ user: user });
            if (check) {
                let checkProduct = await Wishlist.findOne({ user: user, 'wishlistItems.productId': { $in: [new ObjectId(productId)] } })
                if (checkProduct) {
                    //console.log('falied')
                    res.json({ status: 'fail', message: 'Item has already been added to the wishlist.' });
                } else {
                    let updatewish = await Wishlist.updateOne({ user: user }, { $push: { wishlistItems: { productId: new ObjectId(productId) } } });
                    if (updatewish) {
                        //console.log('success')
                        res.json({ status: 'success' });
                    }
                }
            } else {
                const wishListData = {
                    user: new ObjectId(user),
                    wishlistItems: [{ productId: new ObjectId(productId) }],
                };

                const newWishList = new Wishlist(wishListData);
                await newWishList.save();
                console.log('created')
                return { status: 'success' };
            }
        } else {
            console.log('errrrorr') 
            res.json({ status: 'error', message: 'Please Login to add products to wishlist' })
        }
    } catch (err) {
        res.json({ status: 'error', message: err })
        console.log(err);
    }
 
}
 
//remove item from wishlist
const removeItem = async (req, res) => {
    try {
        const productId = req.body.productId;
        const user = req.session.isAuthUser
        const delelteItem = await Wishlist.updateOne({ user: user }, { $pull: { wishlistItems: { productId: new ObjectId(productId) } } });
        if (delelteItem) {
            res.json({ status: 'success' });
        }
    } catch (err) {
        res.json({ status: 'error' })
        console.log(err);
    }
}

module.exports = {
    addToWishlist,
    loadWishlist,
    removeItem
}
