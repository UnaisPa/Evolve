const DealOfMonth = require('../model/dealOfModel');
const Products = require('../model/productModel');

//admin side
const loadDealOfMonth = async(req,res)=>{
    try{
        const products = await Products.find();
        const processedData = products.map(item => ({
            ...item.toObject(),
            // Add properties as "own properties" as needed
            ownProperty: item.mobile,
        }));

        const deal= await DealOfMonth.findOne();

        res.render('dealOfMonth',{products:processedData,deal})
        //const dealOfMonth = await DealOfMonth.find().populate('Product');
    }catch(err){
        res.render('error',{message:'The page not found!'})
        console.log(err)
    }
}

const addNewDeal = async(req,res)=>{
    try{
        const product = req.body.product
        const productDeatails = await Products.findOne({name:product});
        const offer = Math.round(  ((productDeatails.price - productDeatails.offerprice) /  productDeatails.price) * 100)
        const description = productDeatails.description
        console.log(offer);
        console.log(productDeatails.image[0]);
        // const newDeal = new DealOfMonth({
        //     productName:product,
        //     offer:offer,
        //     description:description
        // })
        // await newDeal.save();
        
        const deal = await DealOfMonth.findOne();
        const newDeal = await DealOfMonth.updateOne({_id:deal.id},{$set:{productName:product,offer:offer,description:description,image:productDeatails.image[0]}});
        if(newDeal){
            res.redirect('/admin/deal_of_month')
        }
       
    }catch(err){
        res.render('error',{message:'An Error occured'})
        console.log(err)
    }
}

module.exports={
    loadDealOfMonth,
    addNewDeal
}