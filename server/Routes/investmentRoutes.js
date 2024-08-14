const express=require('express');
const { verifyTokenForOnlySuperAdmin, verifyToken, verifyTokenForOnlySuperAdminOrAdmin } = require('../Middlewares/verifyToken');
const { validateId } = require('../Middlewares/verifyId');
const { connectStoreDb } = require('../Middlewares/connectStoreDb');
const { createInvestment, getAllInvestments, getSingleInvestment, updateInvestment, deleteInvestment } = require('../Controllers/investmentController');

const investmentRoutes=express.Router();

investmentRoutes.post('/create',verifyTokenForOnlySuperAdminOrAdmin,connectStoreDb,createInvestment);

investmentRoutes.get('/',verifyTokenForOnlySuperAdminOrAdmin,connectStoreDb,getAllInvestments);

investmentRoutes.get('/:investmentId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,getSingleInvestment);

investmentRoutes.put('/:investmentId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,updateInvestment);

investmentRoutes.delete('/:investmentId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,deleteInvestment);

module.exports={investmentRoutes};