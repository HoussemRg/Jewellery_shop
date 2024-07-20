const express=require('express');
const { createStore, getAllStores,getSingleStore,updateStore,deleteStore } = require('../Controllers/storeController');
const { verifyTokenForOnlySuperAdmin } = require('../Middlewares/verifyToken');
const { validateId } = require('../Middlewares/verifyId');

const storeRoute=express.Router();

storeRoute.post('/create',createStore);

storeRoute.get('/',verifyTokenForOnlySuperAdmin,getAllStores);

storeRoute.get('/:id',verifyTokenForOnlySuperAdmin,validateId,getSingleStore);

storeRoute.put('/:id',verifyTokenForOnlySuperAdmin,validateId,updateStore);

storeRoute.delete('/:id',verifyTokenForOnlySuperAdmin,validateId,deleteStore);

module.exports={storeRoute}