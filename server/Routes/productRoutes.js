const express=require('express');
const { verifyTokenForOnlySuperAdminOrAdmin, verifyToken } = require('../Middlewares/verifyToken');
const { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, updateProductPhoto } = require('../Controllers/productController');
const { uploadProductPhoto } = require('../Middlewares/uploadPhoto');


const productRoutes=express.Router();

productRoutes.post('/create',verifyTokenForOnlySuperAdminOrAdmin,uploadProductPhoto.single('image'),createProduct);

productRoutes.get('/:storeId',verifyTokenForOnlySuperAdminOrAdmin,getAllProducts);

productRoutes.get('/:storeId/:productId',verifyToken,getSingleProduct);

productRoutes.put('/:storeId/:productId',verifyTokenForOnlySuperAdminOrAdmin,updateProduct);

productRoutes.delete('/:storeId/:productId',verifyTokenForOnlySuperAdminOrAdmin,deleteProduct);

productRoutes.put('/:storeId/:productId',verifyTokenForOnlySuperAdminOrAdmin,uploadProductPhoto.single('image'),updateProductPhoto);

module.exports={productRoutes};