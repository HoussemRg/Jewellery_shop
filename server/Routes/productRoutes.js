const express=require('express');
const { verifyTokenForOnlySuperAdminOrAdmin, verifyToken } = require('../Middlewares/verifyToken');
const { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, updateProductPhoto, getNumberOfProducts, filterProducts, getTopSellingProducts, getAllProductsList } = require('../Controllers/productController');
const { uploadProductPhoto } = require('../Middlewares/uploadPhoto');
const { validateId } = require('../Middlewares/verifyId');
const { connectStoreDb } = require('../Middlewares/connectStoreDb');


const productRoutes=express.Router();

productRoutes.post('/create',verifyTokenForOnlySuperAdminOrAdmin,uploadProductPhoto.single('image'),connectStoreDb,createProduct);

productRoutes.get('/',verifyToken,connectStoreDb,getAllProducts);

productRoutes.get('/all',verifyToken,connectStoreDb,getAllProductsList);

productRoutes.get('/top',verifyTokenForOnlySuperAdminOrAdmin,connectStoreDb,getTopSellingProducts);

productRoutes.get('/count',verifyToken,connectStoreDb,getNumberOfProducts);

productRoutes.get('/filter',verifyToken,connectStoreDb,filterProducts);

productRoutes.get('/:productId',verifyToken,connectStoreDb,validateId,getSingleProduct);

productRoutes.put('/:productId',verifyTokenForOnlySuperAdminOrAdmin,validateId,uploadProductPhoto.single('image'),connectStoreDb,updateProduct);

productRoutes.delete('/:productId',verifyTokenForOnlySuperAdminOrAdmin,validateId,connectStoreDb,deleteProduct);

productRoutes.put('/:productId',verifyTokenForOnlySuperAdminOrAdmin,validateId,uploadProductPhoto.single('image'),connectStoreDb,updateProductPhoto);



module.exports={productRoutes};