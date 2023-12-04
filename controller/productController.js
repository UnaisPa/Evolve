const Product = require('../model/productModel');
const Category = require('../model/categoryModel');

//GET Method for Products
const loadProducts = async(req,res)=>{
    try{
        const page = req.query.page || 1
        let category = req.query.category || "Allcategories"
        const deletedProduct = req.query.deletedProduct
        let size = 10
        const skip = (page - 1) * size

        if(category==='Allcategories'){
            var rawData = await Product.find().limit(size).skip(skip)
            var count = await Product.countDocuments()
        }else{
            var cate = category
            var rawData = await Product.find({category:category}).limit(size).skip(skip)
            var count = await Product.countDocuments({category:category})
        }
        const categories = await Category.find()
        const Allcategories = categories.map(item => ({
            ...item.toObject(),
            // Add properties as "own properties" as needed
            ownProperty: item.mobile,
          }));
        const processedData = rawData.map(item => ({
          ...item.toObject(),
          // Add properties as "own properties" as needed
          ownProperty: item.mobile,
        }));
        //res.json('Successfull')
        

        if(deletedProduct){
            return res.render('products',{products:processedData,deletedProduct,categories:Allcategories,size,count,cate})
        }

        res.render('products',{products:processedData,categories:Allcategories,size,count,cate})
    }catch(err){
        throw new Error(err)
    }
}

//GET Method for add products
const loadAddProduct = async(req,res)=>{
    try{
        const productadded = req.query.productadded
        const rawData = await Category.find()
        const processedData = rawData.map(item => ({
          ...item.toObject(),
          // Add properties as "own properties" as needed
          ownProperty: item.mobile,
        }));
        if(productadded){
            return res.render('add-product',{addProduct:true,category:processedData,productadded});
        }
        res.render('add-product',{addProduct:true,category:processedData});
    }catch(err){
        throw new Error(err)
    }
}

//POST method for ADD PRODUCT
const insertProduct = async(req,res)=>{
    try{
        //console.log(req.files);
        const imageFileNames = req.files.map((file)=>file.filename);
        //const imageFileNames = req.files.filename

        const product = new Product({
            name:req.body.name,
            category:req.body.category,
            price:req.body.price,
            offerprice:req.body.offerprice,
            quantity:req.body.quantity,
            description:req.body.description,
            image:imageFileNames,
            badge:req.body.badge,
            color:req.body.color
        })

        const result = await product.save()
        if(result){
            const productadded = true
            res.redirect(`/admin/products/add_product?productadded=${productadded}`);
        }else{
            res.send('an error occured')
        }
    }catch(err){
        throw new Error(err)
    }
}

//GET method for edit products
const loadEditProduct = async (req,res)=>{
    try{
        const {id} = req.params
        const product = await Product.findOne({_id:id});
        const rawData = await Category.find({name:{$ne:product.category}})

        const processedData = rawData.map(item => ({
          ...item.toObject(),
          // Add properties as "own properties" as needed
          ownProperty: item.mobile,
        }));

        const success = req.query.success
        const name = product.name
        const category = product.category
        const price = product.price
        const offerprice = product.offerprice
        const description = product.description
        const badge = product.badge
        const quantity = product.quantity
        const image = product.image
        const color = product.color

        if(success){
        return res.render('edit-product',{success,categories:processedData,name,category,price,offerprice,description,badge,quantity,image,id,color});

        }
        res.render('edit-product',{categories:processedData,name,category,price,offerprice,description,badge,quantity,image,id,color});
    }catch(err){
        res.render('error',{message:err});
        //throw new Error(err);
        console.log(err)
    }
}
//PUT method for edit_products
const editProduct = async(req,res)=>{
    try{
        const {id} = req.params;
        const imageFileNames = req.files.map((file)=>file.filename);
        const image1 = req.body.image1
        const image2 = req.body.image2
        const image3 = req.body.image3
        const updateProduct = await Product.updateOne({_id:id},{
            $set:{
                name:req.body.name,
                category:req.body.category,
                price:req.body.price,
                offerprice:req.body.offerprice,
                quantity:req.body.quantity,
                description:req.body.description,
                badge:req.body.badge,
                color:req.body.color
            }});

            const update= await Product.updateOne({_id:id},{$push:{image:imageFileNames}})
            const deleteImage = await Product.updateOne({_id:id},{ $pull: { image: { $in: [image1,image2,image3] } } })

        
            if(updateProduct && update && deleteImage){
                const success=true
                res.redirect(`/admin/products/edit_product/${id}?success=${success}`)
                //res.send('Successfully updated')
            }else{
                res.status(500).send('There is an error occured')
            }
    }catch(err){
        throw new Error(err)
    }
}

//GET method for Load soft Delete warning
const loadDeleteProduct = async(req,res)=>{
    try{
        const {id} = req.params
        const product = await Product.findOne({_id:id});
        const productToDelete = product.name
        const rawData = await Product.find()
        const processedData = rawData.map(item => ({
          ...item.toObject(),
          // Add properties as "own properties" as needed
          ownProperty: item.mobile,
        }));
        //res.json('Successfull')
        res.render('products',{products:processedData,productToDelete,id})
    }catch(err){
        //throw new Error(err)
        res.render('error',{message:err});
    }
}
//POST method for Delete Product
const deleteProduct = async(req,res)=>{
    try{
        const {id} = req.params
        const deleteproduct = await Product.deleteOne({_id:id});
        
        if(deleteproduct){
            res.json({status:"success"});
            //const deletedProduct = true
            //res.redirect(`/admin/products?deletedProduct=${deletedProduct}`)
        }else{
            res.json({status:'error'});
        }
    }catch(err){
        throw new Error(err)
    }
}
module.exports ={
    loadAddProduct,
    loadProducts,
    insertProduct,
    loadEditProduct,
    editProduct,
    loadDeleteProduct,
    deleteProduct
}