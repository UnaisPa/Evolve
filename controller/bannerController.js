const Banner = require('../model/bannerModel');


const loadBanner = async(req,res)=>{
    try{
        const added = req.query.added
        const banner = await Banner.findOne()
        if(added){
            return res.render('banner',{added:true,banner});
        }
        res.render('banner',{banner});
    }catch(err){
        console.log(err)
    }
}

//POST method for adding new Banner
const addBanner = async(req,res)=>{
    try{
        const banner = await Banner.findOne();
        const bannerId = banner._id
        const imageName = req.file.filename
        const subheading = req.body.subheading 
        const heading = req.body.heading 
        if(subheading && heading){
            const updateBanner = await Banner.updateOne({_id:bannerId},{$set:{text:subheading,heading:heading,image:imageName}})
            if(updateBanner){
                res.redirect('/admin/banners?added=true');
            }
        }else{
            const updateBanner = await Banner.updateOne({_id:bannerId},{$set:{image:imageName}})
            if(updateBanner){
                res.redirect('/admin/banners?added=true');
            }
        }
        console.log(imageName);
    }catch(err){
        console.log(err)
    }
}

module.exports={
    loadBanner,
    addBanner
}