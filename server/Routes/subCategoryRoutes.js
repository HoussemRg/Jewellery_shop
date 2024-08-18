const express=require('express');
const { verifyTokenForOnlySuperAdminOrAdmin, verifyToken } = require('../Middlewares/verifyToken');
const { validateId } = require('../Middlewares/verifyId');
const { createSubCategory, getAllSubCategories, getSingleSubCategory, updateSubCategory, deleteSubCategory, getTopSellingSubCategories, getSubCategoriesNumber } = require('../Controllers/subCategoryController');
const { connectStoreDb } = require('../Middlewares/connectStoreDb');

const subCategoryRoute=express.Router();

subCategoryRoute.post('/create',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,createSubCategory);

subCategoryRoute.get('/',verifyToken,connectStoreDb,getAllSubCategories);

subCategoryRoute.get('/count',verifyTokenForOnlySuperAdminOrAdmin,connectStoreDb,getSubCategoriesNumber);

subCategoryRoute.get('/top',verifyTokenForOnlySuperAdminOrAdmin,connectStoreDb,getTopSellingSubCategories);

subCategoryRoute.get('/:subCategoryId',verifyToken,validateId,connectStoreDb,getSingleSubCategory);

subCategoryRoute.put('/:subCategoryId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,updateSubCategory);

subCategoryRoute.delete('/:subCategoryId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,deleteSubCategory);

module.exports={subCategoryRoute}