const express=require('express');
const { getAllAdmins, getAllvendors, getSingleUser, updateUser, deleteUser, getUsersForSpecificStore } = require('../Controllers/userController');
const { verifyTokenForOnlySuperAdmin, verifyToken, verifyTokenForOnlySuperAdminOrAdmin } = require('../Middlewares/verifyToken');
const { validateId } = require('../Middlewares/verifyId');

const usersRoutes=express.Router();

usersRoutes.get('/admins',verifyTokenForOnlySuperAdmin,getAllAdmins);

usersRoutes.get('/vendors/:storeId',verifyTokenForOnlySuperAdminOrAdmin,validateId,getAllvendors);

usersRoutes.get('/:id',verifyToken,validateId,getSingleUser);

//usersRoutes.get('/store/:storeId',verifyTokenForOnlySuperAdminOrAdmin,getUsersForSpecificStore);

usersRoutes.put('/:id',verifyTokenForOnlySuperAdminOrAdmin,validateId,updateUser);

usersRoutes.delete('/:id',verifyTokenForOnlySuperAdminOrAdmin,validateId,deleteUser);

module.exports={usersRoutes};