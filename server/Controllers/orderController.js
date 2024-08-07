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

/**---------------------------------
 * @desc create new Order 
 * @route /api/orders/create
 * @request POST
 * @access only admin or superAdmin
 ------------------------------------*/
 const createOrder = asyncHandler(async (req, res) => {
    const storeId = req.user.store;
    const storeConnection = await getConnection("Users");
    const StoreModel = storeConnection.models.Store || storeConnection.model('Store', Store.schema);
    let store = await StoreModel.findById(storeId);
    if (!store)  return res.status(400).send("Store not found");
    const databaseConnection = await getConnection(store.database);
    const ClientModel = databaseConnection.models.Client || databaseConnection.model('Client', Client.schema);
    const OrderModel = databaseConnection.models.Order || databaseConnection.model('Order', Order.schema);
    const ProductModel = databaseConnection.models.Product || databaseConnection.model('Product', Product.schema);
    const OrderDetailsModel = databaseConnection.models.OrderDetails || databaseConnection.model('OrderDetails', OrderDetails.schema);
        const client = await ClientModel.findById(req.body.clientId);
        if (!client)  return res.status(400).send("Client not found");

        let totalAmount = 0;
        let orderDetails = [];

        for (const { productId, quantity } of req.body.productsList) {
            const product = await ProductModel.findById(productId);
            if (!product) return res.status(400).send(`Product with id: ${productId} not found`);
            if (product.stockQuantity < quantity) return res.status(400).send(`Stock quantity of ${product.productName} is insufficient`);

            
            product.stockQuantity -= quantity;
            await product.save();

            totalAmount += product.unitPrice * quantity*product.weight;

            const orderDetail = new OrderDetailsModel({
                
                product: product._id,
                price: (product.unitPrice*quantity*product.weight),
                quantity: quantity
            });
            await orderDetail.save();
            orderDetails.push(orderDetail._id);
            
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
    const storeId = req.user.store;
    const orderId=req.params.orderId
    const storeConnection = await getConnection("Users");
    const StoreModel = storeConnection.models.Store || storeConnection.model('Store', Store.schema);
    let store = await StoreModel.findById(storeId);
    if (!store)  return res.status(400).send("Store not found");
    const databaseConnection = await getConnection(store.database);
    const OrderModel = databaseConnection.models.Order || databaseConnection.model('Order', Order.schema);
    databaseConnection.models.Client || databaseConnection.model('Client', Client.schema);
    let order=await OrderModel.findById(orderId).select('-orderDetails').populate({
        path:'client',
        model:'Client',
        select:'firstName lastName'
    });
    if(!order) return res.status(400).send("Order not found");
    if(req.body.payedAmount > order.totalAmount-order.payedAmount){
        return res.status(400).send("Your payment amount is higher than the total amount");
    }
    order.payedAmount+=req.body.payedAmount;
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
    const storeId = req.user.store;
    const storeConnection = await getConnection("Users");
    const StoreModel = storeConnection.models.Store || storeConnection.model('Store', Store.schema);
    let store = await StoreModel.findById(storeId);
    if (!store)  return res.status(400).send("Store not found");
    const databaseConnection = await getConnection(store.database);
    const OrderModel = databaseConnection.models.Order || databaseConnection.model('Order', Order.schema);
    databaseConnection.models.Client || databaseConnection.model('Client', Client.schema);
    const orders=await OrderModel.find().select('-orderDetails').populate({
        path:'client',
        model:'Client',
        select:'firstName lastName'
    });
    res.status(200).send(orders);
 })
 /**---------------------------------
 * @desc get  order details
 * @route /api/orders/:orderId
 * @request get
 * @access only admin or superAdmin
 ------------------------------------*/
 const getSingleOrder=asyncHandler(async(req,res)=>{
    const storeId = req.user.store;
    const orderId=req.params.orderId;
    const storeConnection = await getConnection("Users");
    const StoreModel = storeConnection.models.Store || storeConnection.model('Store', Store.schema);
    let store = await StoreModel.findById(storeId);
    if (!store)  return res.status(400).send("Store not found");
    const databaseConnection = await getConnection(store.database);
    const OrderModel = databaseConnection.models.Order || databaseConnection.model('Order', Order.schema);
    databaseConnection.models.Client || databaseConnection.model('Client', Client.schema);
    databaseConnection.models.Product || databaseConnection.model('Product', Product.schema);
    databaseConnection.models.Category || databaseConnection.model('Category', Category.schema);
    databaseConnection.models.SubCategory || databaseConnection.model('SubCategory', SubCategory.schema);
    databaseConnection.models.OrderDetails || databaseConnection.model('OrderDetails', OrderDetails.schema);
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
    const storeId = req.user.store;
    const orderId=req.params.orderId
    const storeConnection = await getConnection("Users");
    const StoreModel = storeConnection.models.Store || storeConnection.model('Store', Store.schema);
    let store = await StoreModel.findById(storeId);
    if (!store)  return res.status(400).send("Store not found");
    const databaseConnection = await getConnection(store.database);
    const OrderDetailsModel = databaseConnection.models.OrderDetails || databaseConnection.model('OrderDetails', OrderDetails.schema);
    const OrderModel = databaseConnection.models.Order || databaseConnection.model('Order', Order.schema);
    const order=await OrderModel.findById(orderId);
    if(!order) return res.status(400).send("Order not found");
    await OrderDetailsModel.deleteMany({order:orderId});
    const orderDeleted=await OrderModel.findByIdAndDelete(orderId);
    return res.status(200).send(orderDeleted);

})


module.exports = { createOrder,deleteOrder,payForOrder,getAllOrders,getSingleOrder };
