const express=require('express');
const { verifyTokenForOnlySuperAdmin, verifyToken, verifyTokenForOnlySuperAdminOrAdmin } = require('../Middlewares/verifyToken');
const { validateId } = require('../Middlewares/verifyId');
const { createClient, getAllClients, getSingleClient, updateClient, deleteClient } = require('../Controllers/clientController');

const clientRoutes=express.Router();

clientRoutes.post('/create',verifyTokenForOnlySuperAdminOrAdmin,createClient);

clientRoutes.get('/',verifyTokenForOnlySuperAdminOrAdmin,getAllClients);

clientRoutes.get('/:clientId',verifyTokenForOnlySuperAdminOrAdmin,validateId,getSingleClient);

clientRoutes.put('/:clientId',verifyTokenForOnlySuperAdminOrAdmin,validateId,updateClient);

clientRoutes.delete('/:clientId',verifyTokenForOnlySuperAdminOrAdmin,validateId,deleteClient);

module.exports={clientRoutes};