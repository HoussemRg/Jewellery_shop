const express=require('express');
const { verifyTokenForOnlySuperAdmin, verifyToken, verifyTokenForOnlySuperAdminOrAdmin } = require('../Middlewares/verifyToken');
const { validateId } = require('../Middlewares/verifyId');
const { createOrder, deleteOrder, payForOrder, getAllOrders, getSingleOrder } = require('../Controllers/orderController');

const orderRoutes=express.Router();

orderRoutes.post('/create',verifyTokenForOnlySuperAdminOrAdmin,createOrder);

orderRoutes.get('/',verifyTokenForOnlySuperAdminOrAdmin,getAllOrders);

orderRoutes.get('/:orderId',verifyTokenForOnlySuperAdminOrAdmin,validateId,getSingleOrder);

orderRoutes.delete('/:orderId',verifyTokenForOnlySuperAdminOrAdmin,validateId,deleteOrder);

orderRoutes.put('/:orderId',verifyTokenForOnlySuperAdminOrAdmin,validateId,payForOrder);

module.exports={orderRoutes};
