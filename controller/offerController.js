const Product = require('../model/productModel');
const Cateagory = require('../model/categoryModel');
//Load offer page
const loadOffer = async(req,res)=>{
    try{
        const prodcuts = await Product.find();

        const page = req.query.page || 1
        let size = 8
        const skip = (page - 1) * size
        let rawData = await Product.find().limit(size).skip(skip)
        let categories = await Product.aggregate([
            {
              $group: {
                _id: "$category", // Group by the field you want uniqueness on
                uniqueDoc: { $first: "$$ROOT" } // Use $first to get the first document in each group
              }
            },
            {
              $replaceRoot: { newRoot: "$uniqueDoc" } // Replace the root with the unique document
            }
          ])
        //   const processedCategory = categories.map(item => ({
        //     ...item.toObject(),
        //     // Add properties as "own properties" as needed
        //     ownProperty: item.mobile,
        //   }));
        
        const count = await Product.countDocuments()
        const processedData = rawData.map(item => ({
            ...item.toObject(),
            // Add properties as "own properties" as needed
            ownProperty: item.mobile,
          }));

        res.render('offers',{products:processedData,count,categories:categories});
    }catch(err){
        console.log(err);
    }
}

//Update offer price usnig POST method
const udpateOffer = async(req,res)=>{
    try{
        
        const id = req.body.productId;
        const offerPrice = req.body.offerPrice
        console.log(offerPrice)
        const updateOfferPrice = await Product.updateOne({_id:id},{$set:{offerprice:offerPrice}});
        if(updateOfferPrice){
            res.json({status:'success'});
        }
    }catch(err){
        res.json({status:'error'})
        console.log(er)
    }
}

const updateCategoryOffer = async(req,res)=>{
    try{
        const id = req.body.productId
        const offerPercentage = req.body.offerPercentage
        const product = await Product.findOne({_id:id});
        const category = product.category;
        const products = await Product.find({category:category});
        products.forEach(async (product) => {
            const newOfferPrice = (offerPercentage / 100) * product.price;
            const newPrice = product.price - newOfferPrice;

            // Update the product
            await Product.findByIdAndUpdate(product._id, {$inc:{offerprice: -1*newOfferPrice},
                price: newPrice,
            });
        });
        res.json({status:'success'});

    }catch(err){
        console.log(err)
    }
}
module.exports={loadOffer,udpateOffer,updateCategoryOffer};