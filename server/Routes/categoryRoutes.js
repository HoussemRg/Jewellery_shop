const express=require('express');
const { verifyTokenForOnlySuperAdminOrAdmin, verifyToken } = require('../Middlewares/verifyToken');
const { createCategory, getAllCategories, getSingleCategory, updateCategory, deleteCategory, getSingleCategoryProductsCount } = require('../Controllers/categoryController');
const { validateId } = require('../Middlewares/verifyId');

const categoryRoute=express.Router();

categoryRoute.post('/create',verifyTokenForOnlySuperAdminOrAdmin,validateId,createCategory);

categoryRoute.get('/',verifyToken,validateId,getAllCategories);


categoryRoute.put('/:categoryId',verifyTokenForOnlySuperAdminOrAdmin,validateId,updateCategory);

categoryRoute.delete('/:categoryId',verifyTokenForOnlySuperAdminOrAdmin,validateId,deleteCategory);


module.exports={categoryRoute}