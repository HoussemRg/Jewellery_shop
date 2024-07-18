const express=require('express');
const { createStore, getAllStores,getSingleStore,updateStore,deleteStore } = require('../Controllers/storeController');
const { verifyTokenForOnlySuperAdmin } = require('../Middlewares/verifyToken');

const storeRoute=express.Router();

storeRoute.post('/create',createStore);

storeRoute.get('/',verifyTokenForOnlySuperAdmin,getAllStores);

storeRoute.get('/:id',verifyTokenForOnlySuperAdmin,getSingleStore);

storeRoute.put('/:id',verifyTokenForOnlySuperAdmin,updateStore);

storeRoute.delete('/:id',verifyTokenForOnlySuperAdmin,deleteStore);

module.exports={storeRoute}