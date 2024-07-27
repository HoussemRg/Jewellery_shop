const express=require('express');
const { verifyTokenForOnlySuperAdminOrAdmin, verifyToken } = require('../Middlewares/verifyToken');
const { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, updateProductPhoto, getNumberOfProducts } = require('../Controllers/productController');
const { uploadProductPhoto } = require('../Middlewares/uploadPhoto');
const { validateId } = require('../Middlewares/verifyId');


const productRoutes=express.Router();

productRoutes.post('/create',verifyTokenForOnlySuperAdminOrAdmin,validateId,uploadProductPhoto.single('image'),createProduct);

productRoutes.get('/',verifyTokenForOnlySuperAdminOrAdmin,validateId,getAllProducts);

productRoutes.get('/count',verifyToken,validateId,getNumberOfProducts);

productRoutes.get('/:productId',verifyToken,validateId,getSingleProduct);

productRoutes.put('/:productId',verifyTokenForOnlySuperAdminOrAdmin,validateId,uploadProductPhoto.single('image'),updateProduct);

productRoutes.delete('/:productId',verifyTokenForOnlySuperAdminOrAdmin,validateId,deleteProduct);

productRoutes.put('/:productId',verifyTokenForOnlySuperAdminOrAdmin,validateId,uploadProductPhoto.single('image'),updateProductPhoto);

module.exports={productRoutes};