const mongoose=require('mongoose');
const joi=require('joi');

const stockSchema=new mongoose.Schema({
    purchasePrice:{
        type:Number,
        required:true,        
    },
    sellingPrice:{
        type:Number,
        required:true,        
    },
    stockQuantity:{
        type:Number,
        required:true,
    },
    productPhoto:{
        type:Buffer,
    },
    product:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true,
        default:[]
    }],
    store:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Store',
        required:true
    }
});



const Stock=mongoose.model('Stock',stockSchema);

module.exports={Stock};