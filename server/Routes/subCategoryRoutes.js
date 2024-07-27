const express=require('express');
const { verifyTokenForOnlySuperAdminOrAdmin, verifyToken } = require('../Middlewares/verifyToken');
const { validateId } = require('../Middlewares/verifyId');
const { createSubCategory, getAllSubCategories, getSingleSubCategory, updateSubCategory, deleteSubCategory } = require('../Controllers/subCategoryController');

const subCategoryRoute=express.Router();

subCategoryRoute.post('/create/:storeId',verifyTokenForOnlySuperAdminOrAdmin,validateId,createSubCategory);

subCategoryRoute.get('/',verifyToken,validateId,getAllSubCategories);

subCategoryRoute.get('/:storeId/:subCategoryId',verifyToken,validateId,getSingleSubCategory);

subCategoryRoute.put('/:storeId/:subCategoryId',verifyTokenForOnlySuperAdminOrAdmin,validateId,updateSubCategory);

subCategoryRoute.delete('/:storeId/:subCategoryId',verifyTokenForOnlySuperAdminOrAdmin,validateId,deleteSubCategory);

module.exports={subCategoryRoute}