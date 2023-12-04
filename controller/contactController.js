const User = require('../model/userModel');
const Contact = require('../model/contactModel');
//Admin side
const loadContactAdmin = async(req,res)=>{
    try{
        const contacts = await Contact.find();
        const processedData = contacts.map(item => ({
            ...item.toObject(),
            // Add properties as "own properties" as needed
            ownProperty: item.mobile,
          }));
        res.render('contact',{contacts:processedData});
    }catch(err){
        console.log(err)
    }
}

//User side
const loadContactUser = async(req,res)=>{
    try{
        if(req.session.isAuthUser){
           return res.render('contact',{verified:true});
        }
        res.render('contact',{notLogin:true});
    }catch(err){
        console.log(err)
    }
}

const addContact = async(req,res)=>{
    try{
        const {name,email,subject,message}= req.body
        if(subject){
            const saveContact = new Contact({
                name:name,
                email:email,
                subject:subject,
                message:message
            });
            await saveContact.save()
        }else{
            const saveContact = new Contact({
                name:name,
                email:email,
                message:message
            });
            await saveContact.save()
        }

        res.json({status:'success'});
    }catch(err){
        res.json({status:'error'});
        console.log(err)
    }
}
module.exports={
    loadContactAdmin,
    loadContactUser,
    addContact
}