const User = require('../model/userModel');
const Product = require('../model/productModel');
const Review = require('../model/reviewModel');

const addProductReview = async (req, res) => {
    try {
        const { product, rating, review } = req.body
        const userID = req.session.isAuthUser
        const user = await User.findOne({ _id: userID });
        let userName = user.name
        // console.log(userName);
        // console.log(product, rating, review);

        const dateToString = new Date()
        const isDate = new Date(dateToString);

        const options = { year: "numeric", month: "long", day: "numeric" };
        const formattedDate = isDate.toLocaleDateString("en-US", options);

        const newReview = new Review({
            product: product,
            rating: rating,
            review: review,
            user: userName,
            formattedDate:formattedDate
        })
        await newReview.save();

        res.json({ status: 'success' });

    } catch (err) {
        res.json({ status: 'error' })
        console.log(err)
    }
}

module.exports = {
    addProductReview
}