const express=require('express');
const { verifyTokenForOnlySuperAdminOrAdmin, verifyToken } = require('../Middlewares/verifyToken');
const { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, updateProductPhoto, getNumberOfProducts } = require('../Controllers/productController');
const { uploadProductPhoto } = require('../Middlewares/uploadPhoto');
const { validateId } = require('../Middlewares/verifyId');


const productRoutes=express.Router();

productRoutes.post('/create',verifyTokenForOnlySuperAdminOrAdmin,validateId,uploadProductPhoto.single('image'),createProduct);

productRoutes.get('/',verifyTokenForOnlySuperAdminOrAdmin,validateId,getAllProducts);

productRoutes.get('/count',verifyTokenForOnlySuperAdminOrAdmin,validateId,getNumberOfProducts);

productRoutes.get('/:storeId/:productId',verifyToken,validateId,getSingleProduct);

productRoutes.put('/:storeId/:productId',verifyTokenForOnlySuperAdminOrAdmin,validateId,updateProduct);

productRoutes.delete('/:storeId/:productId',verifyTokenForOnlySuperAdminOrAdmin,validateId,deleteProduct);

productRoutes.put('/:storeId/:productId',verifyTokenForOnlySuperAdminOrAdmin,validateId,uploadProductPhoto.single('image'),updateProductPhoto);

module.exports={productRoutes};