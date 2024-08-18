const asyncHandler = require('express-async-handler');
const { getConnection } = require('../Utils/dbconnection');
const mongoose = require('mongoose');
const { Order } = require('../Models/Order');
const { OrderDetails } = require('../Models/OrderDetails');
const { Client } = require('../Models/client');
const { Product } = require('../Models/Product');
const { Store } = require('../Models/Store');
const { Category } = require('../Models/Category');
const { SubCategory } = require('../Models/SubCategory');
const { populate } = require('dotenv');
const { Investment } = require('../Models/investment');
const { Coupon } = require('../Models/Coupon');
const { Gain } = require('../Models/Gain');

/**---------------------------------
 * @desc create new Order 
 * @route /api/orders/create
 * @request POST
 * @access only admin or superAdmin
 ------------------------------------*/
 const createOrder = asyncHandler(async (req, res) => {    
    const ClientModel = req.storeDb.models.Client || req.storeDb.model('Client', Client.schema);
    const OrderModel = req.storeDb.models.Order || req.storeDb.model('Order', Order.schema);
    const ProductModel = req.storeDb.models.Product || req.storeDb.model('Product', Product.schema);
    const OrderDetailsModel = req.storeDb.models.OrderDetails || req.storeDb.model('OrderDetails', OrderDetails.schema);
    const CategoryModel = req.storeDb.models.Category || req.storeDb.model('Category', Category.schema);
    const SubCategoryModel = req.storeDb.models.SubCategory || req.storeDb.model('SubCategory', SubCategory.schema);
    const InvestmentModel = req.storeDb.models.Investment || req.storeDb.model('Investment', Investment.schema);
    const GainModel = req.storeDb.model('Gain', Gain.schema);

    req.storeDb.models.Coupon || req.storeDb.model('Coupon', Coupon.schema);
        const client = await ClientModel.findById(req.body.clientId);
        if (!client)  return res.status(400).send("Client not found");
        const now=Date.now();
        let totalAmount = 0;
        let orderDetails = [];

        for (const { productId, quantity } of req.body.productsList) {
            let discountRates=[];
            const product = await ProductModel.findById(productId).populate({
                path:'coupon',
                model:'Coupon',
                select: '-product ',
            });
            if (!product) return res.status(400).send(`Product with id: ${productId} not found`);
            if (product.stockQuantity < quantity) return res.status(400).send(`Stock quantity of ${product.productName} is insufficient`);

            
            product.stockQuantity -= quantity;
            await product.save();
            
            totalAmount += product.unitPrice * quantity*product.weight;

            for(const coupon of product.coupon ){
                
                if(now>=coupon.startDate && now<=coupon.expirationDate){
                    totalAmount-=((product.unitPrice*coupon.discountRate)/100)*quantity*product.weight;
                    discountRates.push(coupon.discountRate)
                }
            }
            const category=await CategoryModel.findById(product.category).populate({
                path:'coupon',
                model:'Coupon',
                select: '-product -category -subCategory ',
            }); 
            for(const coupon of category.coupon){
                if(now>=coupon.startDate && now<=coupon.expirationDate){
                    totalAmount-=((product.unitPrice*coupon.discountRate)/100)*quantity*product.weight;
                    discountRates.push(coupon.discountRate)
                }
            }
            const subCategory=await SubCategoryModel.findById(product.subCategory).populate({
                path:'coupon',
                model:'Coupon',
                select: '-product -category -subCategory ',
            }); 
            for(const coupon of subCategory.coupon){
                if(now>=coupon.startDate && now<=coupon.expirationDate){
                    totalAmount-=((product.unitPrice*coupon.discountRate)/100)*quantity*product.weight;
                    discountRates.push(coupon.discountRate)
                }
            }
            let discountRatesSum=0;
            discountRates.forEach((dis)=> discountRatesSum+=dis)
            const orderDetail = new OrderDetailsModel({
                
                product: product._id,
                price: (product.unitPrice*quantity*product.weight)-(((product.unitPrice*quantity*product.weight)*discountRatesSum)/100),
                quantity: quantity
            });
            await orderDetail.save();
            orderDetails.push(orderDetail._id);
            
            if (product.purchaseSource === 'Investor') {
                const investment = await InvestmentModel.findById(product.investment);
                if (investment) {
                    const gain = (product.unitPrice * quantity * product.weight) - (product.purchasePrice * quantity*product.weight);
                    investment.gain += gain;
                    await investment.save();
                }
            }else if(product.purchaseSource === 'Owner'){
                const gain=await  GainModel.findOne();
                if(gain){
                    gain.gain-=product.purchasePrice*product.weight*quantity;
                    await gain.save();
                }
            }
        }

        
        
        const order = new OrderModel({
            orderDetails,
            totalAmount,
            client: client._id,
            payedAmount: req.body.payedAmount ? req.body.payedAmount : 0
        });
        
        await order.save();
        client.order.push(order._id);
        await client.save();
        await OrderDetailsModel.updateMany(
            { _id: { $in: order.orderDetails } },
            { $set: { order: order._id } }
        ); 

     

        res.status(201).send({ message: 'Order created successfully' });
    
});

/**---------------------------------
 * @desc Pay for Order 
 * @route /api/orders/:orderId
 * @request post
 * @access only admin or superAdmin
 ------------------------------------*/

 const payForOrder=asyncHandler(async(req,res)=>{
    const orderId=req.params.orderId
    const OrderModel = req.storeDb.models.Order || req.storeDb.model('Order', Order.schema);
    const GainModel = req.storeDb.models.Gain || req.storeDb.model('Gain', Gain.schema);

    req.storeDb.models.Client || req.storeDb.model('Client', Client.schema);
    let order=await OrderModel.findById(orderId).select('-orderDetails').populate({
        path:'client',
        model:'Client',
        select:'firstName lastName'
    });
    if(!order) return res.status(400).send("Order not found");
    if(req.body.payedAmount > order.totalAmount-order.payedAmount){
        return res.status(400).send("Your payment amount is higher than the total amount");
    }
    const gain=await GainModel.findOne();
    if (!gain) {
        return res.status(404).send('Gain not found');
    }
    
    order.payedAmount+=req.body.payedAmount;
    gain.gain+=req.body.payedAmount;
    await gain.save();
    if(order.totalAmount-order.payedAmount === 0){
        order.paymentStatus=true;
    }
    await order.save();
    return res.status(200).send(order);
 })

/**---------------------------------
 * @desc get all orders
 * @route /api/orders
 * @request get
 * @access only admin or superAdmin
 ------------------------------------*/
 const getAllOrders=asyncHandler(async(req,res)=>{
    const OrderModel = req.storeDb.models.Order || req.storeDb.model('Order', Order.schema);
    req.storeDb.models.Client || req.storeDb.model('Client', Client.schema);
    const orders=await OrderModel.find().select('-orderDetails').populate({
        path:'client',
        model:'Client',
        select:'firstName lastName'
    });
    const count=await OrderModel.countDocuments();
    res.status(200).send(orders);
 })
 /**---------------------------------
 * @desc get  orders number
 * @route /api/orders/count
 * @request get
 * @access only admin or superAdmin
 ------------------------------------*/
 const getOrdersNumber=asyncHandler(async(req,res)=>{
    const OrderModel = req.storeDb.models.Order || req.storeDb.model('Order', Order.schema);
    const count=await OrderModel.countDocuments();
    res.status(200).send({count:count});
 })
 /**---------------------------------
 * @desc get  order details
 * @route /api/orders/:orderId
 * @request get
 * @access only admin or superAdmin
 ------------------------------------*/
 const getSingleOrder=asyncHandler(async(req,res)=>{
    const orderId=req.params.orderId;
    const OrderModel = req.storeDb.models.Order || req.storeDb.model('Order', Order.schema);
    req.storeDb.models.Client || req.storeDb.model('Client', Client.schema);
    req.storeDb.models.Product || req.storeDb.model('Product', Product.schema);
    req.storeDb.models.Category || req.storeDb.model('Category', Category.schema);
    req.storeDb.models.SubCategory || req.storeDb.model('SubCategory', SubCategory.schema);
    req.storeDb.models.OrderDetails || req.storeDb.model('OrderDetails', OrderDetails.schema);
    const order=await OrderModel.findById(orderId).select('-orderDetails').populate({
        path:'client',
        model:'Client',
        select:'firstName lastName cin email address phoneNumber '
    }).populate({
        path:'orderDetails',
        model:'OrderDetails',
        select:'-order',
        populate: {
            path: 'product',
            model: 'Product',
            select: '-productPhoto -createdAt -updatedAt -purchasePrice -store',
            populate:[{
                path: 'category',
                model: 'Category',
                select: '-product -categoryDescription'
            },
            {
                path: 'subCategory',
                model: 'SubCategory',
                select: '-product -subCategoryDescription'
            }]
        }
    });

    res.status(200).send(order);

 })


/**---------------------------------
 * @desc delete Order 
 * @route /api/orders/:orderId
 * @request delete
 * @access only admin or superAdmin
 ------------------------------------*/

const deleteOrder=asyncHandler(async(req,res)=>{
    const orderId=req.params.orderId
    const OrderDetailsModel = req.storeDb.models.OrderDetails || req.storeDb.model('OrderDetails', OrderDetails.schema);
    const OrderModel = req.storeDb.models.Order || req.storeDb.model('Order', Order.schema);
    const order=await OrderModel.findById(orderId);
    if(!order) return res.status(404).send("Order not found");
    await OrderDetailsModel.deleteMany({order:orderId});
    const orderDeleted=await OrderModel.findByIdAndDelete(orderId);
    return res.status(200).send(orderDeleted);

})





module.exports = { createOrder,deleteOrder,payForOrder,getAllOrders,getSingleOrder ,getOrdersNumber};
