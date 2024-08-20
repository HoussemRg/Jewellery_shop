const express=require('express');
const { createStore, getAllStores,getSingleStore,updateStore,deleteStore } = require('../Controllers/storeController');
const { verifyTokenForOnlySuperAdmin, verifyTokenForOnlySuperAdminOrAdmin } = require('../Middlewares/verifyToken');
const { validateId } = require('../Middlewares/verifyId');

const storeRoute=express.Router();

storeRoute.post('/create',verifyTokenForOnlySuperAdmin,createStore);

storeRoute.get('/',verifyTokenForOnlySuperAdmin,getAllStores);

storeRoute.get('/:id',verifyTokenForOnlySuperAdminOrAdmin,validateId,getSingleStore);

storeRoute.put('/:id',verifyTokenForOnlySuperAdmin,validateId,updateStore);

storeRoute.delete('/:id',verifyTokenForOnlySuperAdmin,validateId,deleteStore);

module.exports={storeRoute}