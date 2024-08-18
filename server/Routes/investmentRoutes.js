const express=require('express');
const { verifyTokenForOnlySuperAdmin, verifyToken, verifyTokenForOnlySuperAdminOrAdmin } = require('../Middlewares/verifyToken');
const { validateId } = require('../Middlewares/verifyId');
const { connectStoreDb } = require('../Middlewares/connectStoreDb');
const { createInvestment, getAllInvestments, getSingleInvestment, updateInvestment, deleteInvestment, getAllInvestmentsPerInvestor, controlInvestments } = require('../Controllers/investmentController');

const investmentRoutes=express.Router();

investmentRoutes.post('/create',verifyTokenForOnlySuperAdminOrAdmin,connectStoreDb,createInvestment);

investmentRoutes.get('/',verifyTokenForOnlySuperAdminOrAdmin,connectStoreDb,getAllInvestments);

investmentRoutes.put('/status',verifyTokenForOnlySuperAdminOrAdmin,connectStoreDb,controlInvestments);

investmentRoutes.get('/investor/:investorId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,getAllInvestmentsPerInvestor);

investmentRoutes.get('/:investmentId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,getSingleInvestment);

investmentRoutes.put('/:investmentId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,updateInvestment);

investmentRoutes.delete('/:investmentId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,deleteInvestment);

module.exports={investmentRoutes};