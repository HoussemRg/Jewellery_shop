const express=require('express');
const { verifyTokenForOnlySuperAdminOrAdmin, verifyToken } = require('../Middlewares/verifyToken');
const { validateId } = require('../Middlewares/verifyId');
const { createSubCategory, getAllSubCategories, getSingleSubCategory, updateSubCategory, deleteSubCategory } = require('../Controllers/subCategoryController');
const { connectStoreDb } = require('../Middlewares/connectStoreDb');

const subCategoryRoute=express.Router();

subCategoryRoute.post('/create',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,createSubCategory);

subCategoryRoute.get('/',verifyToken,validateId,connectStoreDb,getAllSubCategories);

subCategoryRoute.get('/:subCategoryId',verifyToken,validateId,connectStoreDb,getSingleSubCategory);

subCategoryRoute.put('/:subCategoryId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,updateSubCategory);

subCategoryRoute.delete('/:subCategoryId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,deleteSubCategory);

module.exports={subCategoryRoute}