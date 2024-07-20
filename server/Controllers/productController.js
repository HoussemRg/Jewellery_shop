const mongoose=require('mongoose');
const asyncHandler=require('express-async-handler');
const { validateCreateProduct, Product, validateUpdateProduct } = require('../Models/Product');
const fs=require('fs');
const { getConnection } = require('../Utils/dbconnection');
const { Store } = require('../Models/Store');
const path = require('path');


/**---------------------------------
 * @desc create new product 
 * @route /api/products
 * @request Post
 * @access for only admin or super admin
 ------------------------------------*/
 const createProduct=asyncHandler(async(req,res)=>{
    const {error}=validateCreateProduct(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const storeConnection=getConnection("Users");
    const StoreModel=storeConnection.model('Store',Store.schema);
    let store= await StoreModel.findById(req.body.store);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=getConnection(store.database);
    const ProductModel=databaseConnection.model('Product',Product.schema);
    let product=await ProductModel.create({
        productName:req.body.productName,
        description:req.body.description,
        carat:req.body.carat,
        weight:req.body.weight,
        productPhoto:req.file ? req.file.buffer : fs.readFileSync(path.join(__dirname,'../assets/productPhoto.jpg')),
        purchasePrice:req.body.purchasePrice,
        unitPrice:req.body.unitPrice,
        stockQuantity:req.body.stockQuantity,
        store:store._id
    });
    store.product.push(product._id);
    await store.save();
    return res.status(201).send(product);
 })

/**---------------------------------
 * @desc get all products for a store 
 * @route /api/products/:storeId
 * @request Get
 * @access for only admin or super admin
 ------------------------------------*/

const getAllProducts=asyncHandler(async(req,res)=>{
    const storeId=req.params.storeId;
    const storeConnection=getConnection("Users");
    const StoreModel=storeConnection.model('Store',Store.schema);
    let store= await StoreModel.findById(storeId);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=getConnection(store.database);
    const ProductModel=databaseConnection.model('Product',Product.schema);
   
    const products=await ProductModel.find();
    const count=await ProductModel.countDocuments();
    return res.status(200).send({products,count})
})


/**---------------------------------
 * @desc get single product 
 * @route /api/products/:storeId/:productId
 * @request Get
 * @access public
 ------------------------------------*/
const getSingleProduct=asyncHandler(async(req,res)=>{
    const storeId=req.params.storeId;
    const storeConnection=getConnection("Users");
    const StoreModel=storeConnection.model('Store',Store.schema);
    let store= await StoreModel.findById(storeId);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=getConnection(store.database);
    const ProductModel=databaseConnection.model('Product',Product.schema);
    const product=await ProductModel.findById(req.params.productId);
    if(!product) return res.status(400).send("Product not found");
    return res.status(200).send(product);
})

/**---------------------------------
 * @desc update product 
 * @route /api/products/:storeId/:productId
 * @request Put
 * @access only admin and super admin
 ------------------------------------*/

const updateProduct=asyncHandler(async(req,res)=>{
    const {error}=validateUpdateProduct(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const storeId=req.params.storeId;
    const storeConnection=getConnection("Users");
    const StoreModel=storeConnection.model('Store',Store.schema);
    let store= await StoreModel.findById(storeId);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=getConnection(store.database);
    const ProductModel=databaseConnection.model('Product',Product.schema);
    let product=await ProductModel.findById(req.params.productId);
    if(!product) return res.status(400).send("Product not found");
    const newProduct=req.body;
    product=await ProductModel.findByIdAndUpdate(req.params.productId,
        {$set:newProduct},
        {new:true}
    );
    return res.status(201).send(product);
    

})

/**---------------------------------
 * @desc delete product 
 * @route /api/products/:storeId/:productId
 * @request delete
 * @access only admin and super admin
 ------------------------------------*/
 const deleteProduct=asyncHandler(async(req,res)=>{
    const storeId=req.params.storeId;
    const storeConnection=getConnection("Users");
    const StoreModel=storeConnection.model('Store',Store.schema);
    let store= await StoreModel.findById(storeId);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=getConnection(store.database);
    const ProductModel=databaseConnection.model('Product',Product.schema);
    let product=await ProductModel.findById(req.params.productId);
    if(!product) return res.status(400).send("Product not found");
    store.product=store.product.filter(productId=> productId.toString() !== product._id.toString());  
    await store.save();
    await ProductModel.findByIdAndDelete(product._id);
    return res.status(200).send("Product deleted successfully");
})

const updateProductPhoto=asyncHandler(async(req,res)=>{
    if(!req.file){
        return res.status(400).send("No image provided");
    }
    const storeId=req.params.storeId;
    const storeConnection=getConnection("Users");
    const StoreModel=storeConnection.model('Store',Store.schema);
    let store= await StoreModel.findById(storeId);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=getConnection(store.database);
    const ProductModel=databaseConnection.model('Product',Product.schema);
    let product=await ProductModel.findById(req.params.productId);
    if(!product) return res.status(400).send("Product not found");
    product.productPhoto=req.file.buffer;
    product.save();
    const updatedProduct=await ProductModel.findById(req.params.productId);
    return res.status(201).send(updatedProduct);
})


module.exports={createProduct,getAllProducts,getSingleProduct,updateProduct,deleteProduct,updateProductPhoto};