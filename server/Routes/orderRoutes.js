const express=require('express');
const { verifyTokenForOnlySuperAdmin, verifyToken, verifyTokenForOnlySuperAdminOrAdmin } = require('../Middlewares/verifyToken');
const { validateId } = require('../Middlewares/verifyId');
const { createOrder, deleteOrder, payForOrder, getAllOrders, getSingleOrder, getOrdersNumber } = require('../Controllers/orderController');
const { connectStoreDb } = require('../Middlewares/connectStoreDb');

const orderRoutes=express.Router();

orderRoutes.post('/create',verifyTokenForOnlySuperAdminOrAdmin,connectStoreDb,createOrder);

orderRoutes.get('/',verifyTokenForOnlySuperAdminOrAdmin,connectStoreDb,getAllOrders);

orderRoutes.get('/count',verifyTokenForOnlySuperAdminOrAdmin,connectStoreDb,getOrdersNumber);

orderRoutes.get('/:orderId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,getSingleOrder);

orderRoutes.delete('/:orderId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,deleteOrder);

orderRoutes.put('/:orderId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,payForOrder);

module.exports={orderRoutes};
