const mongoose=require('mongoose');
const joi=require('joi');


const gainSchema=new mongoose.Schema({
    gain:{
        type:Number,
        required:true,
        default:0
    },
});

const Gain=mongoose.model('Gain',gainSchema);

module.exports={Gain}