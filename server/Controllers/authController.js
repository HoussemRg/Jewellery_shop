const asyncHandler=require('express-async-handler');
const { User,validateRegisterUser, validateLoginUser } = require('../Models/User');
const mongoose=require('mongoose');
const bycrypt=require("bcrypt");
const { getConnection, connections } = require('../Utils/dbconnection');
const { Store } = require('../Models/Store');



/**---------------------------------
 * @desc register / sign up new user 
 * @route /api/auth/register
 * @resquest Post
 * @acess public
 ------------------------------------*/

 const registerUser=asyncHandler(async(req,res)=>{
    const {error}=validateRegisterUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const userConnection=await getConnection('Users');
    
    const userModel= userConnection.model('User',User.schema);
    let user=await userModel.findOne({email:req.body.email});
    if(user) return res.status(400).send('User already exists');
    const salt=await bycrypt.genSalt(parseInt(process.env.SALTROUND));
    const hashedPassword=await bycrypt.hash(req.body.password,salt);
    user=await userModel.create({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        cin:req.body.cin,
        email:req.body.email,
        password:hashedPassword,
        address:req.body.address,
        phoneNumber:req.body.phoneNumber,
        role:req.body.role,
        store:req.body.store
    });
    const storeModel= userConnection.model('Store',Store.schema);
    let store= await storeModel.findById(user.store);
    if(!store) return res.status(400).send('Store not found');
    store.user.push(user._id);
    await store.save();
    
    return res.status(201).send(user);
 })



/**---------------------------------
 * @desc login  
 * @route /api/auth/login
 * @resquest Post
 * @acess public
 ------------------------------------*/

 const loginUser=asyncHandler(async(req,res)=>{
    const {error}=validateLoginUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);
   
    const userConnection=await getConnection('Users');
    const userModel= userConnection.model('User',User.schema);
    const user=await userModel.findOne({email:req.body.email});
    if(!user) return res.status(400).send('invalid email or password');
    const isPasswordMatch=await bycrypt.compare(req.body.password,user.password);
    if(!isPasswordMatch) return res.status(400).send('invalid email or password');
    const token=user.generateAuthToken();
    return res.status(200).send({
        id:user._id,
        token:token,
        firstName:user.firstName,
        lastName:user.lastName,
        role:user.role,
        store:user.store
    })
 })

const regenrateTokenForSuperAdmin=asyncHandler(async(req,res)=>{
    const userId=req.user.id;
    const {storeId}=req.body;
    const userConnection=await getConnection('Users');
    const userModel= userConnection.model('User',User.schema);
    let user=await userModel.findById(userId);
    if(!user) return res.status(400).send('Server error,please login again');
    user.store=storeId;
    const newToken=user.generateAuthToken();
    return res.status(200).send({
        id:user._id,
        token:newToken,
        firstName:user.firstName,
        lastName:user.lastName,
        role:user.role,
        store:user.store
    })
})

module.exports={registerUser,loginUser,regenrateTokenForSuperAdmin};