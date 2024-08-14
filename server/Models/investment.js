const mongoose=require('mongoose');
const joi=require('joi');

const investmentSchema=new mongoose.Schema({
    investmentName:{
        type:String,
        required:true,
        unique:true
    },
    investor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Investor',
        required:true
    },
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default:[]
    }],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    investmentState:{
        type:String,
        enum: ['Active', 'inActive'],
        default:'inActive'
    },
    investmentAmount:{
        type:Number,
        required:true
    },
    investedAmount:{
        type:Number,
        default:0
    },
    gain:{
        type:Number,
        default:0,    
    }
    
},{timestamps:true});

const validateCreateInvestment=(obj)=>{
    const schema=joi.object({
        investmentName:joi.string().required(),
        investor:joi.string().required(),
        startDate:joi.date().required(),
        endDate:joi.date().required().greater(joi.ref('startDate')).messages({
            'date.greater': '"endDate" must be greater than "startDate"',
        }),
        investmentAmount:joi.number().min(0).required()
    })
    return schema.validate(obj);
}



const validateUpdateInvestment=(obj)=>{
    const schema=joi.object({
        investor:joi.string(),
        startDate:joi.date(),
        endDate:joi.date(),
        investmentAmount:joi.number().min(0)
    })
    return schema.validate(obj);
}


const Investment=mongoose.model('Investment',investmentSchema);
module.exports=  {Investment,validateCreateInvestment,validateUpdateInvestment};