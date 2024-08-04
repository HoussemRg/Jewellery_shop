const mongoose=require('mongoose');

const orderDetailsSchema=new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    price:{
        type:Number,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Order',
        
    }
    
},{timestamps:true});

const OrderDetails=mongoose.model('OrderDetails',orderDetailsSchema);
module.exports=  {OrderDetails};