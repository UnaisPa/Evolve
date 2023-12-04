const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var usermodel  = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    is_admin:{
        type:Number,
        default:0
    },
    otp:{
        type:Number,
        default:null
    },
    cart:{
        type:Array,
        default:[]
    },
    wishlist:{
        type:Array,
        default:[]

    },
    address:{
        type:Array,
        default:[]
    },

    createdAt: { type: Date, default:Date.now()},
    expiresAt: { type: Date, default:Date.now() + 5 * 60 * 1000 },

    verified:{
        type:Boolean,
        default:false
    },
    is_blocked:{
        type:Boolean,
        default:false
    }

})

usermodel.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password,salt);
    this.password = hashedPassword
    next()
})
usermodel.methods.isPasswordMatched=async(ernteredPassword)=>{
    return await bcrypt.compare(ernteredPassword,this.password)
}




module.exports=new mongoose.model('UserData',usermodel)
