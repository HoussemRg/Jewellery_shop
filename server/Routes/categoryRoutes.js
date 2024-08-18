const express=require('express');
const { verifyTokenForOnlySuperAdminOrAdmin, verifyToken } = require('../Middlewares/verifyToken');
const { createCategory, getAllCategories, updateCategory, deleteCategory, getTopSellingCategories, getCategoriesNumber } = require('../Controllers/categoryController');
const { validateId } = require('../Middlewares/verifyId');
const { connectStoreDb } = require('../Middlewares/connectStoreDb');

const categoryRoute=express.Router();

categoryRoute.post('/create',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,createCategory);

categoryRoute.get('/',verifyToken,connectStoreDb,getAllCategories);

categoryRoute.get('/count',verifyTokenForOnlySuperAdminOrAdmin,connectStoreDb,getCategoriesNumber);

categoryRoute.get('/top',verifyTokenForOnlySuperAdminOrAdmin,connectStoreDb,getTopSellingCategories);

categoryRoute.put('/:categoryId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,updateCategory);

categoryRoute.delete('/:categoryId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,deleteCategory);


module.exports={categoryRoute}