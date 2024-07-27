const express=require('express');
const { verifyTokenForOnlySuperAdminOrAdmin, verifyToken } = require('../Middlewares/verifyToken');
const { createCategory, getAllCategories, getSingleCategory, updateCategory, deleteCategory } = require('../Controllers/categoryController');
const { validateId } = require('../Middlewares/verifyId');

const categoryRoute=express.Router();

categoryRoute.post('/create',verifyTokenForOnlySuperAdminOrAdmin,validateId,createCategory);

categoryRoute.get('/',verifyToken,validateId,getAllCategories);

categoryRoute.get('/:categoryId',verifyToken,validateId,getSingleCategory);

categoryRoute.put('/:categoryId',verifyTokenForOnlySuperAdminOrAdmin,validateId,updateCategory);

categoryRoute.delete('/:categoryId',verifyTokenForOnlySuperAdminOrAdmin,validateId,deleteCategory);


module.exports={categoryRoute}