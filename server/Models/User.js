const mongoose = require('mongoose');
const joi=require('joi');
const bycrypt=require('bcrypt');
require('dotenv').config();
const passwordComplexity = require('joi-password-complexity');
const jwt=require('jsonwebtoken')

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
        maxlength:100,
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
        ref:'Store',
        
    },
    role:{
        type:String,
        enum:['admin','superAdmin','vendor'],
        required:true
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


userSchema.methods.generateAuthToken=function(){
    return jwt.sign({id:this._id,role:this.role},process.env.JWT_SECRET);
}

const validateRegisterUser=(obj)=>{
    const schema=joi.object({
        firstName:joi.string().min(3).max(50).trim().required(),
        lastName:joi.string().min(3).max(50).trim().required(),
        cin:joi.string().required().trim().pattern(/^[0-9]+$/),
        email:joi.string().email().required().pattern(/^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/),
        password:joi.string().required(),
        phoneNumber:joi.string().required(),
        address: joi.string().required().trim().min(10).max(50),
        role:joi.string().valid('admin','superAdmin', 'vendor').optional(),
        store:joi.required()
    })
    return schema.validate(obj);
}

const validateLoginUser=(obj)=>{
    const schema=joi.object({
        email:joi.string().email().required().pattern(/^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/),
        password:joi.string().required(),
    })
    return schema.validate(obj);
}

const validateUpdateUser=(obj)=>{
    const schema=joi.object({
        firstName:joi.string().min(3).max(50).trim(),
        lastName:joi.string().min(3).max(50).trim(),
        cin:joi.string().required().trim().pattern(/^[0-9]+$/),
        
        password:joi.string().allow('', null),
        phoneNumber:joi.string(),
        address: joi.string().trim().min(10).max(50),
        role:joi.string().valid('admin','superAdmin', 'vendor').optional(),
        
    })
}

const User=mongoose.models.User || mongoose.model("User",userSchema);

module.exports={User,validateRegisterUser,validateLoginUser,validateUpdateUser}