const mongoose=require('mongoose');
const bycrypt=require('bcrypt');
const asyncHandler=require('express-async-handler');
const { validateStore, Store, validateUpdateStore } = require('../Models/Store');
const { User } = require('../Models/User');
const { getConnection, connections } = require('../Utils/dbconnection');

const { Product } = require('../Models/Product');



/**---------------------------------
 * @desc create new store 
 * @route /api/stores
 * @request Post
 * @access public
 ------------------------------------*/
 const createStore = asyncHandler(async (req, res) => {
    const { error } = validateStore(req.body);
    if (error) return res.status(401).send(error.details[0].message);
    const connection = getConnection('Users');
    
    
    const StoreModel = connection.model('Store', Store.schema);
    let store=await StoreModel.findOne({storeName:req.body.storeName});
    if(store) return res.status(400).send("Store alreadt exists");
    const sanitizedStoreName = req.body.storeName.replace(/ /g, '_');
    store = await StoreModel.create({
        storeName: req.body.storeName,
        address: req.body.address,
        description: req.body.description,
        database: `${ sanitizedStoreName}`,
        
    });  
    
    /*const newDatabase =mongoose.createConnection(
        `${process.env.DB_URI_P1}${sanitizedStoreName}${process.env.DB_URI_P2}`,      
    );
    console.log(newDatabase)*/
    //createDatabase(sanitizedStoreName);
    
    return res.status(201).send(store);
});
/**---------------------------------
 * @desc get all stores store 
 * @route /api/stores
 * @request Get
 * @access private for only super admin
 ------------------------------------*/
const getAllStores=asyncHandler(async(req,res)=>{
    const connection = getConnection('Users');
    const StoreModel = connection.model('Store', Store.schema);
    
    const stores = await StoreModel.find().select("-database");
    const count=await StoreModel.countDocuments();
    res.status(200).send({stores:stores,count:count});

});

/**---------------------------------
 * @desc get single store 
 * @route /api/stores/:id
 * @request Get
 * @access private for only admin or superAdmin
 ------------------------------------*/
const getSingleStore=asyncHandler(async(req,res)=>{
    const storeId=req.params.id;
    const connection = getConnection('Users');
    const StoreModel = connection.model('Store', Store.schema);
    connection.model('User',User.schema);
    const store=await StoreModel.findById(storeId).select(' -database ').populate({
        path:'user',
        model:'User',
        select:"-password -store "
    })
    if(!store) return res.status(400).send('Store not found');
    return res.status(200).send(store);
})

/**---------------------------------
 * @desc update store 
 * @route /api/stores/:id
 * @request Put
 * @access private for only admin or superAdmin
 ------------------------------------*/

 const updateStore=asyncHandler(async(req,res)=>{
    const { error }=validateUpdateStore(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const storeId=req.params.id;
    const connection = getConnection('Users');
    const StoreModel = connection.model('Store', Store.schema);
    connection.model('User',User.schema);
    let newStore=req.body;
    newStore=await StoreModel.findByIdAndUpdate(storeId,
        {$set:newStore},
        {new:true}
    ).select(' -database ').populate({
        path:'user',
        model:'User',
        select:"-password -store "
    });
    return res.status(201).send(newStore);
 })
/**---------------------------------
 * @desc delete store 
 * @route /api/stores/:id
 * @request delete
 * @access private for only for superAdmin
 ------------------------------------*/
 const deleteStore=asyncHandler(async (req,res)=>{
    const storeId=req.params.id;
    const connection = getConnection('Users');
    const StoreModel = connection.model('Store', Store.schema);
    const UserModel=connection.model('User',User.schema);
    const store=await StoreModel.findById(storeId);
    if(!store) return res.status(400).send("Store not found");
    store.user.forEach(async(userId) => {
        await UserModel.findByIdAndDelete(userId);
    });
    const storeConnection=getConnection(store.database);
    const productModel=storeConnection.model('Product',Product.schema);
    store.product.forEach(async(productId) => {
        await productModel.findByIdAndDelete(productId);
    });
    
    await StoreModel.findByIdAndDelete(storeId);
    return res.status(200).send("Store deleted successfully");
 })
 
module.exports = { createStore,getAllStores,getSingleStore,updateStore,deleteStore };