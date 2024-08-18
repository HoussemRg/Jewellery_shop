const express=require('express');
const { verifyTokenForOnlySuperAdminOrAdmin } = require('../Middlewares/verifyToken');
const { getGain,getGainPerYear } = require('../Controllers/gainController');
const { connectStoreDb } = require('../Middlewares/connectStoreDb');

const gainRoute=express.Router();

gainRoute.get('/',verifyTokenForOnlySuperAdminOrAdmin,connectStoreDb,getGain);

gainRoute.get('/:year',verifyTokenForOnlySuperAdminOrAdmin,connectStoreDb,getGainPerYear);




module.exports={gainRoute}