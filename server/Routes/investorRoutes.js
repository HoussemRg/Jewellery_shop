const express=require('express');
const { verifyTokenForOnlySuperAdmin, verifyToken, verifyTokenForOnlySuperAdminOrAdmin } = require('../Middlewares/verifyToken');
const { validateId } = require('../Middlewares/verifyId');
const {  createInvestor, getAllInvestors, getSingleInvestor, updateInvestor, deleteInvestor } = require('../Controllers/investorController');
const { connectStoreDb } = require('../Middlewares/connectStoreDb');

const investorRoutes=express.Router();

investorRoutes.post('/create',verifyTokenForOnlySuperAdminOrAdmin,connectStoreDb,createInvestor);

investorRoutes.get('/',verifyTokenForOnlySuperAdminOrAdmin,connectStoreDb,getAllInvestors);

investorRoutes.get('/:investorId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,getSingleInvestor);

investorRoutes.put('/:investorId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,updateInvestor);

investorRoutes.delete('/:investorId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,deleteInvestor);

module.exports={investorRoutes};