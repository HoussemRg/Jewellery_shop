const mongoose=require('mongoose');
const joi=require('joi');
const bycrypt=require('bcrypt');
const { encrypt } = require('../Utils/decrypt');
require('dotenv').config();

const storeSchema=new mongoose.Schema({
    storeName:{
        type:String,
        required:true,
        trim:true,
        maxlength:50,
        minlength:5,
        
    },
    address:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
        maxlength:50
    },
    description:{
        type:String,
        required:true,
        trim:true,
        minlength:5
    },
    database:{
        type:String,
        required:true,
        trim:true,
    },
    user:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        default:[]
    }]
},{timestamps:true});



const validateStore=(obj)=>{
    const schema=joi.object({
        storeName:joi.string().min(5).max(50).required().trim(),
        address:joi.string().min(5).max(50).required().trim(),
        description:joi.string().min(5).required().trim(),
        
    });
    return schema.validate(obj);
}

const validateUpdateStore=(obj)=>{
    const schema=joi.object({
        storeName:joi.string().min(5).max(50).trim(),
        address:joi.string().min(5).max(50).trim(),
        description:joi.string().min(5).trim(),
    });
    return schema.validate(obj);
}
const Store=mongoose.model('Store',storeSchema);

module.exports={Store,validateStore,validateUpdateStore};

