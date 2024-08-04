const mongoose=require('mongoose');

const orderSchema=new mongoose.Schema({
    orderDetails:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'OrderDetails',
        required:true
    }],
    totalAmount:{
        type:Number,
        required:true,
    },
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Client',
        required:true
    },

    paymentStatus:{
        type:Boolean,
        default:false,
    },

    payedAmount:{
        type:Number,
        default:0
    }
    
},{timestamps:true});

const Order=mongoose.model('Order',orderSchema);
module.exports= {Order};