const express=require('express');
const { verifyTokenForOnlySuperAdmin, verifyToken, verifyTokenForOnlySuperAdminOrAdmin } = require('../Middlewares/verifyToken');
const { validateId } = require('../Middlewares/verifyId');
const { createCoupon, getAllCoupons, updateCoupon, deleteCoupon, applyCoupon, getCouponsPerType } = require('../Controllers/couponController');
const { connectStoreDb } = require('../Middlewares/connectStoreDb');

const couponRoutes=express.Router();

couponRoutes.post('/create',verifyTokenForOnlySuperAdminOrAdmin,connectStoreDb,createCoupon);

couponRoutes.get('/',verifyToken,connectStoreDb,getAllCoupons);

couponRoutes.get('/filter/:couponType',verifyToken,connectStoreDb,getCouponsPerType);


couponRoutes.put('/:couponId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,updateCoupon);

couponRoutes.delete('/:couponId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,deleteCoupon);

couponRoutes.post('/apply/:couponId/:itemId',verifyToken,validateId,connectStoreDb,applyCoupon);

module.exports={couponRoutes}