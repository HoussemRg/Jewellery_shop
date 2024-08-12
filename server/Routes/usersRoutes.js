const express=require('express');
const {  getAllvendors, getSingleUser, updateUser, deleteUser } = require('../Controllers/userController');
const { verifyTokenForOnlySuperAdmin, verifyToken, verifyTokenForOnlySuperAdminOrAdmin } = require('../Middlewares/verifyToken');
const { validateId } = require('../Middlewares/verifyId');

const usersRoutes=express.Router();


usersRoutes.get('/vendors',verifyTokenForOnlySuperAdminOrAdmin,getAllvendors);

usersRoutes.get('/:id',verifyToken,validateId,getSingleUser);


usersRoutes.put('/:id',verifyTokenForOnlySuperAdminOrAdmin,validateId,updateUser);

usersRoutes.delete('/:id',verifyTokenForOnlySuperAdminOrAdmin,validateId,deleteUser);

module.exports={usersRoutes};