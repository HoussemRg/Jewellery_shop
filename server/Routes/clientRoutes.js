const express=require('express');
const { verifyTokenForOnlySuperAdmin, verifyToken, verifyTokenForOnlySuperAdminOrAdmin } = require('../Middlewares/verifyToken');
const { validateId } = require('../Middlewares/verifyId');
const { createClient, getAllClients, getSingleClient, updateClient, deleteClient, getClientsNumber } = require('../Controllers/clientController');
const { connectStoreDb } = require('../Middlewares/connectStoreDb');

const clientRoutes=express.Router();

clientRoutes.post('/create',verifyTokenForOnlySuperAdminOrAdmin,connectStoreDb,createClient);

clientRoutes.get('/',verifyToken,connectStoreDb,getAllClients);

clientRoutes.get('/count',verifyTokenForOnlySuperAdminOrAdmin,connectStoreDb,getClientsNumber);

clientRoutes.get('/:clientId',verifyToken,validateId,connectStoreDb,getSingleClient);

clientRoutes.put('/:clientId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,updateClient);

clientRoutes.delete('/:clientId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,deleteClient);

module.exports={clientRoutes};