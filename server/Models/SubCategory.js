const mongoose=require('mongoose');
const joi=require('joi');


const subCategorySchema=new mongoose.Schema({
    subCategoryName:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:50
    },
    subCategoryDescription:{
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
    }]
});

const validateCreateSubCategory=(obj)=>{
    const schema=joi.object({
        subCategoryName:joi.string().required().trim().min(3).max(50),
        subCategoryDescription:joi.string().required().trim().min(5).max(200),
    });
    return schema.validate(obj);
}

const validateUpdateSubCategory=(obj)=>{
    const schema=joi.object({
        subCategoryName:joi.string().trim().min(3).max(50),
        subCategoryDescription:joi.string().trim().min(5).max(200),
    });
    return schema.validate(obj);
}

const SubCategory=mongoose.model('SubCategorie',subCategorySchema);

module.exports={SubCategory,validateCreateSubCategory,validateUpdateSubCategory}