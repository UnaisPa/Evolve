const { ObjectId } = require('mongodb')
const User = require('../model/userModel')
const Cart = require('../model/cartModel');
const Address = require('../model/addressModel');
//GET method for render progile page

const loadProfile = async (req, res) => {
    try {
        const id = req.session.isAuthUser
        const rawData = await User.findOne({ _id: id })
        const user = await User.findOne({ _id: req.session.isAuthUser });
        const userCart = await Cart.findOne({ user: req.session.isAuthUser });
        const address = await Address.findOne({ user: id })
        var addressNotFound = true
        
        
        if (!address || address.address.length==0) {
             addressNotFound = true
        } else {
            var userAddress = address.address[0]
            addressNotFound = false
        }
        if(userCart){
            var cartItemsCount = userCart.cartItems.reduce((acc, product) => {
                return acc += product.quantity;
            }, 0)
        }

        const dateFromMongo = new Date(user.createdAt);

        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateFromMongo);
        if (cartItemsCount == 0) {
            cartItemsCount = false;
        }
        //console.log(dateFromMongo)
        res.render('profile', { verified: true, user: rawData, userAddress, formattedDate, addressNotFound, cartItemsCount })


    } catch (err) {
        throw new Error(err)
    }
}

const logoutUser = async (req, res) => {
    try {
        req.session.isAuthUser = false
        console.log('helo')
        res.json({status:'success'})
    } catch (err) {
        throw new Error(err)
    }
}

//POST method for Edit address
const editAddress = async (req, res) => {
    try {
        const userId = req.session.isAuthUser
        const { name, mobile, city, district, pincode, state, address, addressId } = req.body
        const updatedAddress = await Address.findOneAndUpdate({ user:userId, 'address._id': addressId },
            {
                $set: {
                    'address.$.name': name,
                    'address.$.mobile': mobile,
                    'address.$.city': city,
                    'address.$.pincode': pincode,
                    'address.$.district': district,
                    'address.$.state': state,
                    'address.$.address':address,
                }
            },
            { new: true });
            
            if(updatedAddress){
                res.json({status:'success'});
            }
    } catch (err) {
        res.json({status:'error',message:err})
        throw new Error(err)
    }
}


//POSt method
const deleteAddress = async (req, res) => {
    try {
        console.log(req.body.productId)
        const userId = req.session.isAuthUser
        let userAddress = await Address.findOne({ user: userId });
        const updateAddress = await Address.updateOne({ user: userId }, { $pop: { address: -1 } })
        if (updateAddress) {
            if (userAddress.address.length === 1) {
                userAddress.address[0].is_default = true;
            }

            res.json({ status: 'success' })
        }

    } catch (err) {
        res.json({ staus: 'error', message: err })
        throw new Error(err)
    }
}


const saveAddress = async (req, res) => {
    try {
        const userId = req.session.isAuthUser
        const { name, mobile, city, district, pincode, state, address } = req.body
        const newAddress = {
            name: name,
            mobile: mobile,
            city: city,
            district: district,
            pincode: pincode,
            state: state,
            address: address
        }
        let userAddress = await Address.findOne({ user: userId });
        if (!userAddress) {
            userAddress = new Address({
                user: userId,
                address: [newAddress]
            })
        } else {
            userAddress.address.push(newAddress);
            if (userAddress.address.length === 1) {
                userAddress.address[0].is_default = true;
            }
        }
        await userAddress.save();
        res.json({ status: 'success' });

    } catch (err) {
        throw new Error(err)
    }
}
//POST edit profile
const editProfile = async (req, res) => {
    try {
        const id = req.session.isAuthUser
        const { name } = req.body
        const updateUser = await User.updateOne({ _id: id }, { $set: { name: name } });
        if (updateUser) {
            res.json({status:'success'})
        }
    } catch (err) {
        throw new Error(err)
    }
}

module.exports = {

    loadProfile,
    logoutUser,
    editAddress,
    deleteAddress,
    saveAddress,
    editProfile,
}