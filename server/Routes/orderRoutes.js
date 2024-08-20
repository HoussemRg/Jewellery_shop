const express=require('express');
const { verifyTokenForOnlySuperAdmin, verifyToken, verifyTokenForOnlySuperAdminOrAdmin } = require('../Middlewares/verifyToken');
const { validateId } = require('../Middlewares/verifyId');
const { createOrder, deleteOrder, payForOrder, getAllOrders, getSingleOrder, getOrdersNumber } = require('../Controllers/orderController');
const { connectStoreDb } = require('../Middlewares/connectStoreDb');

const orderRoutes=express.Router();

orderRoutes.post('/create',verifyToken,connectStoreDb,createOrder);

orderRoutes.get('/',verifyToken,connectStoreDb,getAllOrders);

orderRoutes.get('/count',verifyToken,connectStoreDb,getOrdersNumber);

orderRoutes.get('/:orderId',verifyToken,validateId,connectStoreDb,getSingleOrder);

orderRoutes.delete('/:orderId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,deleteOrder);

orderRoutes.put('/:orderId',verifyToken,validateId,connectStoreDb,payForOrder);

module.exports={orderRoutes};
