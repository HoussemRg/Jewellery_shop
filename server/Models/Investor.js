const mongoose=require('mongoose');
const joi=require('joi');

const investorSchema=new mongoose.Schema({
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
    
    investment:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Investment',
        default:[]
    }]
    

    
},{timestamps:true});


const validateCreateInvestor=(obj)=>{
    const schema=joi.object({
        firstName:joi.string().min(3).max(50).trim().required(),
        lastName:joi.string().min(3).max(50).trim().required(),
        cin:joi.string().required().trim().pattern(/^[0-9]+$/),
        email:joi.string().email().required().pattern(/^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/),
        phoneNumber:joi.string().required(),
        address: joi.string().required().trim().min(10).max(50),
        
    })
    return schema.validate(obj);
}



const validateUpdateInvestor=(obj)=>{
    const schema=joi.object({
        firstName:joi.string().min(3).max(50).trim(),
        lastName:joi.string().min(3).max(50).trim(),
        cin:joi.string().trim().pattern(/^[0-9]+$/),
        phoneNumber:joi.string(),
        address: joi.string().trim().min(10).max(50),
      
        
    })
    return schema.validate(obj)
}


const Investor=mongoose.model('Investor',investorSchema);
module.exports= {Investor,validateCreateInvestor,validateUpdateInvestor};