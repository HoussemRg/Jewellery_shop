const mongoose = require('mongoose');
const joi=require('joi');
const bycrypt=require('bcrypt');
require('dotenv').config();
const passwordComplexity = require('joi-password-complexity');


const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minlength:3,
        maxlength:50,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        minlength:3,
        maxlength:50,
        trim:true
    },
    cin:{
        type:String,
        required:true,
        minlength:8,
        maxlength:8,
        trim:true,
        match:/^[0-9]+$/,
    },
    email:{
        type :String,
        required:true,
        minlength:10,
        maxlength:100,
        unique:true,
        match:/^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    password:{
        type:String,
        required:true,
        minlength:10,
        maxlength:50,
        trim:true
    },
    address:{
        type:String,
        required:true,
        trim:true,
        minlength:10,
        maxlength:50,
    },
    phoneNumber: {
        type: String,
        required: true,
        match: /^[0-9]+$/,
        minlength: 8,    
        maxlength: 8,  
        trim:true  
    },
    store:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Store'
    },
    role:{
        type:String,
        enum:['admin','superAdmin','vendor'],
        default:"admin"
    }

},{timestamps:true});

const complexityOptions = {
    min: 10,  
    max: 50,  
    lowerCase: 1,  
    upperCase: 1,  
    numeric: 1,    
    symbol: 1,    
};


/*
userSchema.pre('save',function(next){
    const user=this;
    
    if(!user.isModified('firstName') ) return next();
    bycrypt.hash(user.firstName,process.env.BCRYPT_SALT_ROUNDS,(err,hash)=>{
        if(err) return next(err);
        user.firstName=hash;
        next();
    });
    if(!user.isModified('lastName') ) return next();
    bycrypt.hash(user.lastName,process.env.BCRYPT_SALT_ROUNDS,(err,hash)=>{
        if(err) return next(err);
        user.lastName=hash;
        next();
    });
    if(!user.isModified('cin') ) return next();
    bycrypt.hash(user.cin,process.env.BCRYPT_SALT_ROUNDS,(err,hash)=>{
        if(err) return next(err);
        user.cin=hash;
        next();
    });
    if(!user.isModified('email') ) return next();
    bycrypt.hash(user.email,process.env.BCRYPT_SALT_ROUNDS,(err,hash)=>{
        if(err) return next(err);
        user.email=hash;
        next();
    });
    if(!user.isModified('password') ) return next();
    bycrypt.hash(user.password,process.env.BCRYPT_SALT_ROUNDS,(err,hash)=>{
        if(err) return next(err);
        user.password=hash;
        next();
    });
    if(!user.isModified('address') ) return next();
    bycrypt.hash(user.address,process.env.BCRYPT_SALT_ROUNDS,(err,hash)=>{
        if(err) return next(err);
        user.address=hash;
        next();
    });
    if(!user.isModified('phoneNumber') ) return next();
    bycrypt.hash(user.phoneNumber,process.env.BCRYPT_SALT_ROUNDS,(err,hash)=>{
        if(err) return next(err);
        user.phoneNumber=hash;
        next();
    });
    if(!user.isModified('store') ) return next();
    bycrypt.hash(user.store,process.env.BCRYPT_SALT_ROUNDS,(err,hash)=>{
        if(err) return next(err);
        user.store=hash;
        next();
    });
    if(!user.isModified('role') ) return next();
    bycrypt.hash(user.role,process.env.BCRYPT_SALT_ROUNDS,(err,hash)=>{
        if(err) return next(err);
        user.role=hash;
        next();
    });
});*/

const validateRegisterUser=(obj)=>{
    const schema=joi.object({
        firstName:joi.string().min(3).max(50).trim().required(),
        lastName:joi.string().min(3).max(50).trim().required(),
        cin:joi.string().required().trim().pattern(/^[0-9]+$/),
        email:joi.string().email().required().pattern(/^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/),
        password:joi.string().required(),
        phoneNumber:joi.string().required(),
        address: joi.string().required().trim().min(10).max(50)
    })
    return schema.validate(obj);
}


const User=mongoose.models.User || mongoose.model("User",userSchema);

module.exports={User,validateRegisterUser}