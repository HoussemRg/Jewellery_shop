const express=require('express');
const { verifyTokenForOnlySuperAdminOrAdmin, verifyToken } = require('../Middlewares/verifyToken');
const { createCategory, getAllCategories, getSingleCategory, updateCategory, deleteCategory } = require('../Controllers/categoryController');
const { validateId } = require('../Middlewares/verifyId');

const categoryRoute=express.Router();

categoryRoute.post('/create/:storeId',verifyTokenForOnlySuperAdminOrAdmin,validateId,createCategory);

categoryRoute.get('/:storeId',verifyToken,validateId,getAllCategories);

categoryRoute.get('/:storeId/:categoryId',verifyToken,validateId,getSingleCategory);

categoryRoute.put('/:storeId/:categoryId',verifyTokenForOnlySuperAdminOrAdmin,validateId,updateCategory);

categoryRoute.delete('/:storeId/:categoryId',verifyTokenForOnlySuperAdminOrAdmin,validateId,deleteCategory);


module.exports={categoryRoute}