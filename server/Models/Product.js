const mongoose=require('mongoose');
const joi=require('joi');

const productSchema=new mongoose.Schema({
    productName:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:50
    },
    description:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
        maxlength:200
    },
    carat:{
        type:Number,
        required:true,
    },
    weight:{
        type:Number,
        required:true
    },
    productPhoto:{
        type:Buffer,
    },
    store:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Store',
        required:true
    },
    purchasePrice:{
        type:Number,
        required:true,        
    },
    unitPrice:{
        type:Number,
        required:true,        
    },
    stockQuantity:{
        type:Number,
        required:true,
    },
    purchaseSource: {
        type: String,
        enum: ['Investor', 'Owner'],
        required: true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    subCategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubCategory',
        required:true
    },
    coupon:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Coupon',
        default:[]
    }],
    investment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Investment',
        validate: {
            validator: function(value) {
                return this.purchaseSource !== 'Owner' || value.length === 0;
            },
            message: 'Investments are only allowed if purchaseSource is Investor.'
        }
    }
},{timestamps:true});

const validateCreateProduct=(obj)=>{
    const schema=joi.object({
        productName:joi.string().required().trim().min(3).max(50),
        description:joi.string().required().trim().min(5).max(200),
        carat:joi.number().required(),
        weight:joi.number().required(),
        store:joi.string(),
        purchasePrice:joi.number().required(),
        unitPrice:joi.number().required(),
        stockQuantity:joi.number().required(),
        category:joi.string(),
        subCategory:joi.string(),
        purchaseSource:joi.string().valid('Investor', 'Owner').required(),
        investment:joi.string().optional()
    });
    return schema.validate(obj);
}

const validateUpdateProduct=(obj)=>{
    const schema=joi.object({
        productName:joi.string().trim().min(3).max(50),
        description:joi.string().trim().min(3).max(200),
        carat:joi.number(),
        weight:joi.number(),
        purchasePrice:joi.number(),
        unitPrice:joi.number(),
        stockQuantity:joi.number(),
        category:joi.string(),
        subCategory:joi.string(),
        purchaseSource:joi.string()
    });
    return schema.validate(obj);
}

const Product=mongoose.model('Product',productSchema);

module.exports={Product,validateCreateProduct,validateUpdateProduct};