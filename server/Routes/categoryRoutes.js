const express=require('express');
const { verifyTokenForOnlySuperAdminOrAdmin, verifyToken } = require('../Middlewares/verifyToken');
const { createCategory, getAllCategories, getSingleCategory, updateCategory, deleteCategory, getSingleCategoryProductsCount } = require('../Controllers/categoryController');
const { validateId } = require('../Middlewares/verifyId');
const { connectStoreDb } = require('../Middlewares/connectStoreDb');

const categoryRoute=express.Router();

categoryRoute.post('/create',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,createCategory);

categoryRoute.get('/',verifyToken,validateId,connectStoreDb,getAllCategories);


categoryRoute.put('/:categoryId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,updateCategory);

categoryRoute.delete('/:categoryId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,deleteCategory);


module.exports={categoryRoute}