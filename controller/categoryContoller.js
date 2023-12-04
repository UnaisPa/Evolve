const Category = require('../model/categoryModel');
const { updateOne, deleteOne } = require('../model/productModel');
const Product = require('../model/productModel');

//Get Method for Category
const loadCategory = async (req, res) => {
    try {
        const categoryadded = req.query.categoryadded
        const rawData = await Category.find()
        const processedData = rawData.map(item => ({
            ...item.toObject(),
            // Add properties as "own properties" as needed
            ownProperty: item.mobile,
        }));

        if (categoryadded) {
            return res.render('category', { category: processedData, categoryadded });
        }
        // Now, pass processedData to your Handlebars template
        res.render('category', { category: processedData });
    } catch (err) {
        throw new Error(err)
    }
}

//POST method for insert category
const insertCategory = async (req, res) => {
    try {
        const { name } = req.body
        
        const alreadyExist = await Category.findOne({ name: name });
        if (alreadyExist) {
            res.json({ status: 'Warning', message: 'This Category is already added!' })
        } else {
            const category = new Category({
                name: name
            })
            const result = await category.save()
            if (result) {
                res.json({ status: 'success' })
                // const categoryadded = true
                // return res.redirect(`/admin/category?categoryadded=${categoryadded}`);
            } else {
                res.json({ status: 'error' });
                //res.redirect('/admin/category');
            }
        }

    } catch (err) {
        throw new Error(err)
    }
}
//GET method for Load edit cat
const loadEditCategory = async (req, res) => {
    try {
        const { id } = req.params
        const rawData = await Category.find()
        const processedData = rawData.map(item => ({
            ...item.toObject(),
            // Add properties as "own properties" as needed
            ownProperty: item.mobile,
        }));

        const category = await Category.findOne({ _id: id })
        const itemToEdit = category.name
        const Id = category._id
        res.render('category', { category: processedData, itemToEdit: itemToEdit, Id });

    } catch (err) {
        throw new Error(err)
    }
}
//POST method for update Category
const editCategory = async (req, res) => {
    try {
        const { id } = req.params
        const category = req.body.name
        const updateCategory = await Category.updateOne({ _id: id }, { $set: { name: category } });
        if (updateCategory) {
            res.json({ status: 'success' })
            //res.redirect('/admin/category')
        } else { 
            res.json({ status: 'error' })
        }
    } catch (err) {
        throw new Error(err)
    }
}

//GET method for verify the category to delete
const loadDeleteCategory = async (req, res) => {
    const { id } = req.params
    const rawData = await Category.find()
    const processedData = rawData.map(item => ({
        ...item.toObject(),
        // Add properties as "own properties" as needed
        ownProperty: item.mobile,
    }));

    const category = await Category.findOne({ _id: id })
    const itemToDelete = category.name
    const Id = category._id
    res.render('category', { category: processedData, itemToDelete: itemToDelete, Id });
}
//POST method for Delete category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params
        const category = await Category.findOne({ _id: id });
        const deletecategory = await Category.deleteOne({ _id: id });
        const deleteProducts = await Product.deleteMany({ category: category.name });
        if (deletecategory && deleteProducts) {
            res.json({status:'success'});
            //res.redirect('/admin/category');
        }else{
            res.json({status:'error'});
        }
    } catch (err) {
        throw new Error(err)
    }
}
module.exports = {
    loadCategory,
    insertCategory,
    loadEditCategory,
    editCategory,
    loadDeleteCategory,
    deleteCategory
}

