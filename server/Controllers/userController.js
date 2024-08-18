const mongoose=require('mongoose');
const asyncHandler=require('express-async-handler');
const { User ,validateUpdateUser} = require('../Models/User');
const {Store} = require('../Models/Store');
const { getConnection } = require('../Utils/dbconnection');
const bcrypt=require('bcrypt');

/**---------------------------------
 * @desc get All admins  
 * @route /api/users/vendors
 * @resquest Get
 * @acess for only super admin or admin
 ------------------------------------*/



 const getAllvendors=asyncHandler(async(req,res)=>{
    const storeId = req.user.store;
    const storeConnection = await getConnection("Users");
    const StoreModel = storeConnection.model('Store', Store.schema);
    let store = await StoreModel.findById(storeId);
    if (!store) return res.status(400).send("Store not found");
    const userModel= storeConnection.model('User',User.schema);
    const users=await userModel.find({store:storeId}).select("-password");
    res.status(200).send(users);
 })

 /**---------------------------------
 * @desc get vendors number  
 * @route /api/users/vendors/count
 * @resquest Get
 * @acess for only super admin or admin
 ------------------------------------*/



 const getVendorsNumber=asyncHandler(async(req,res)=>{
    const storeId = req.user.store;
    const storeConnection = await getConnection("Users");
    const StoreModel = storeConnection.model('Store', Store.schema);
    let store = await StoreModel.findById(storeId);
    if (!store) return res.status(400).send("Store not found");
    const userModel= storeConnection.model('User',User.schema);
    const count=await userModel.countDocuments({role:"vendor"});
    res.status(200).send({count:count});
 })

/**---------------------------------
 * @desc get single user 
 * @route /api/users/:id
 * @resquest Get
 * @acess private for only authenticated
 ------------------------------------*/
const getSingleUser=(asyncHandler(async(req,res)=>{
    const userId=req.params.id;
    const userConnection=await getConnection('Users');
    const userModel= userConnection.model('User',User.schema);
    userConnection.model('Store',Store.schema);
    const user=await userModel.findById(userId).select("-password ").populate({
        path:'store',
        model:'Store',
        select: '_id storeName description address'
    });
    if(!user) return res.status(400).send("User not found");
    return res.status(200).send(user);
}))



/**---------------------------------
 * @desc update single user 
 * @route /api/users/:id
 * @resquest Put
 * @acess only admin or super admin
 ------------------------------------*/

 const updateUser=asyncHandler(async(req,res)=>{
    const {error}=validateUpdateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const userId=req.params.id;
    const userConnection=await getConnection('Users');
    const userModel= userConnection.model('User',User.schema);
    let user=await userModel.findById(userId);
    if(!user) return res.status(400).send("User not found");
    let newUser=req.body;
    if(newUser.password){
        const salt=await bcrypt.genSalt(parseInt(process.env.SALTROUND));
        const hashedPassword=await bcrypt.hash(req.body.password,salt);
        newUser.password=hashedPassword;
    }
    newUser=await userModel.findByIdAndUpdate(userId,
        {$set:newUser},
        {new:true}
    ).select("-password");
    res.status(201).send(newUser);

 })

 /**---------------------------------
 * @desc delete  user 
 * @route /api/users/:id
 * @resquest delete
 * @acess only admin or super admin
 ------------------------------------*/
 const deleteUser=asyncHandler(async(req,res)=>{
    const userId=req.params.id;
    const userConnection=await getConnection('Users');
    const userModel= userConnection.model('User',User.schema);
    let user=await userModel.findById(userId);
    if(!user) return res.status(400).send("User not found");
    const storeModel=userConnection.model('Store',Store.schema);
    let store=await storeModel.findById(user.store);
    if(!store) return res.status(400).send("Store not found")
    store.user=store.user.filter(id => id.toString() !==userId);
    await userModel.findByIdAndDelete(userId);
    await store.save();
    res.status(200).send("User deleted successfully");
    
 })

  



 module.exports={getAllvendors,getSingleUser,updateUser,deleteUser,getVendorsNumber};