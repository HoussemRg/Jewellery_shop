const mongoose=require('mongoose');
const asyncHandler=require('express-async-handler');
const { User ,validateUpdateUser} = require('../Models/User');
const {Store} = require('../Models/Store');
const { getConnection } = require('../Utils/dbconnection');
const bcrypt=require('bcrypt');

/**---------------------------------
 * @desc get All admins  
 * @route /api/users/admins
 * @resquest Get
 * @acess for only super admin
 ------------------------------------*/

 const getAllAdmins=asyncHandler(async(req,res)=>{
    const userConnection=await getConnection('Users');
    const userModel= userConnection.model('User',User.schema);
    
    userConnection.model('Store', Store.schema);
    const users=await userModel.find({role:"admin"}).select("-password -role").populate({
        path:'store',
        model:'Store',
        select: '_id storeName description address'
    });
    const count=await userModel.countDocuments({role:"admin"});
    res.status(200).send({users:users,count:count});
 })

/**---------------------------------
 * @desc get All vendors  
 * @route /api/users/vendors/storeId
 * @resquest Get
 * @acess for only super admin
 ------------------------------------*/
/*
const users=await userModel.find({role:"vendor",store:storeId}).select("-password -role").populate({
        path:'store',
        model:'Store',
        select: '_id storeName description address'
    });
*/
 const getAllvendors=asyncHandler(async(req,res)=>{
    const storeId = req.user.store;
    const storeConnection = await getConnection("Users");
    const StoreModel = storeConnection.model('Store', Store.schema);
    let store = await StoreModel.findById(storeId);
    if (!store) return res.status(400).send("Store not found");
    const userModel= storeConnection.model('User',User.schema);
    const users=await userModel.find({role:"vendor",store:storeId}).select("-password");
    const count=await userModel.countDocuments({role:"vendor"});
    res.status(200).send({users:users,count:count});
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
 * @desc get users for a specific store 
 * @route /api/users/store/:storeId
 * @resquest Get
 * @acess private for only admin or superAdmin
 ------------------------------------*/
/*
const getUsersForSpecificStore=asyncHandler(async(req,res)=>{
    const storeId=req.params.storeId;
    const connection = getConnection('Users');
    const StoreModel = connection.model('Store', Store.schema);
    connection.model('User',User.schema);
    const store=await StoreModel.findById(storeId).select(' user -_id').populate({
        path:'user',
        model:'User',
        select:"-password -store "
    })
    return res.status(200).send(store.user);
})

*/
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

  



 module.exports={getAllAdmins,getAllvendors,getSingleUser,updateUser,deleteUser};