const mongoose=require('mongoose');
const joi=require('joi');

const couponTypes = ['product', 'category', 'subCategory'];

const couponSchema=new mongoose.Schema({
    couponName:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:50
    },
    startDate:{
        type:Date,
        required:true,
        trim:true,
       
    },
    expirationDate: {
        type: Date,
        required: true
    },
    discountRate: {
        type: Number,
        required: true,
        min: 0,
        max: 100 
    },
    type: {
        type: String,
        enum: couponTypes,
        required: true
    },
    product:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        default:[],
        required:function(){
            return this.type === 'product';
        }
    }],
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default:[],
        required: function () {
            return this.type === 'category';
        }
    }],
    subCategory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        default:[],
        required: function () {
            return this.type === 'subCategory';
        }
    }]
},{timestamps:true});

const validateCreateCoupon=(obj)=>{
    const schema=joi.object({
        couponName: joi.string().required().trim().min(3).max(50),
        startDate: joi.date().required(),
        expirationDate: joi.date().required().greater(joi.ref('startDate')).messages({
            'date.greater': '"expirationDate" must be greater than "startDate"',
        }),
        discountRate: joi.number().required().min(0).max(100),
        type: joi.string().valid(...couponTypes).required(),
        product: joi.string().optional().allow(''),
        category: joi.string().optional().allow(''),
        subCategory: joi.string().optional().allow(''),
    });
    return schema.validate(obj);
}

const validateUpdateCoupon=(obj)=>{
    const schema=joi.object({
        couponName: joi.string().trim().min(3).max(50),
        startDate: joi.date(),
        expirationDate: joi.date().greater(joi.ref('startDate')).messages({
            'date.greater': '"expirationDate" must be greater than "startDate"',
        }),
        discountRate: joi.number().min(0).max(100),
    });
    return schema.validate(obj);
}

const Coupon=mongoose.model('Coupon',couponSchema);

module.exports={Coupon,validateCreateCoupon,validateUpdateCoupon}