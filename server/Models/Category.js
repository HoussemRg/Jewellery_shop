const mongoose=require('mongoose');
const joi=require('joi');


const categorySchema=new mongoose.Schema({
    categoryName:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:50
    },
    categoryDescription:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
        maxlength:200
    },
    product:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        default:[]
    }],
    coupon:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Coupon',
        default:[]
    }],
});

const validateCreateCategory=(obj)=>{
    const schema=joi.object({
        categoryName:joi.string().required().trim().min(3).max(50),
        categoryDescription:joi.string().required().trim().min(5).max(200),
    });
    return schema.validate(obj);
}

const validateUpdateCategory=(obj)=>{
    const schema=joi.object({
        categoryName:joi.string().trim().min(3).max(50),
        categoryDescription:joi.string().trim().min(5).max(200),
    });
    return schema.validate(obj);
}

const Category=mongoose.model('Categorie',categorySchema);

module.exports={Category,validateCreateCategory,validateUpdateCategory}