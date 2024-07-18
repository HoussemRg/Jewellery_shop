const express=require('express');
const { getAllAdmins, getAllvendors, getSingleUser, updateUser, deleteUser, getUsersForSpecificStore } = require('../Controllers/userController');
const { verifyTokenForOnlySuperAdmin, verifyToken, verifyTokenForOnlySuperAdminOrAdmin } = require('../Middlewares/verifyToken');

const usersRoutes=express.Router();

usersRoutes.get('/admins',verifyTokenForOnlySuperAdmin,getAllAdmins);

usersRoutes.get('/vendors',verifyTokenForOnlySuperAdmin,getAllvendors);

usersRoutes.get('/:id',verifyToken,getSingleUser);

//usersRoutes.get('/store/:storeId',verifyTokenForOnlySuperAdminOrAdmin,getUsersForSpecificStore);

usersRoutes.put('/:id',verifyTokenForOnlySuperAdminOrAdmin,updateUser);

usersRoutes.delete('/:id',verifyTokenForOnlySuperAdminOrAdmin,deleteUser);

module.exports={usersRoutes};