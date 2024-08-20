const asyncHandler=require('express-async-handler');
const { User,validateRegisterUser, validateLoginUser } = require('../Models/User');
const mongoose=require('mongoose');
const bycrypt=require("bcrypt");
const { getConnection, connections } = require('../Utils/dbconnection');
const { Store } = require('../Models/Store');
const { VerificationTokenModel } = require('../Models/VerificationToken');
const crypto=require('crypto');
const { generateEmailTemplate } = require('../Utils/emailTemplate');
const { sendLoginMail } = require('../lib/sendMailLoginVerification');


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

    const VerificationToken=userConnection.models.VerificationTokenModel||userConnection.model('VerificationToken',VerificationTokenModel.schema);
    const verificationToken=new VerificationToken({
        userId:user._id,
        token:crypto.randomBytes(32).toString("hex")
    });
    await verificationToken.save();
    const link=`${process.env.APP_URL}/users/${user._id}/verify/${verificationToken.token}`
    const template=generateEmailTemplate(link);
    await sendLoginMail(user.email,"verify your Account",template); 

    return res.status(201).send("we sent an email of verification");
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
    if(!user.isAccountVerified){
        const VerificationToken=userConnection.models.VerificationTokenModel||userConnection.model('VerificationToken',VerificationTokenModel.schema);
        let verifyToken=VerificationToken.findOne({userId:user._id});
        if(!verifyToken){
            const verificationToken=new VerificationToken({
                userId:user._id,
                token:crypto.randomBytes(32).toString("hex")
            });
            await verificationToken.save();
            const link=`${process.env.APP_URL}/users/${user._id}/verify/${verificationToken.token}`
            const template=generateEmailTemplate(link);
            await sendLoginMail(user.email,"verify your Account",template);
            return res.status(201).send("we sent an email of verification");
        }
        res.status(400).send("we sent an email of verification ");
        
    }

    const token=user.generateAuthToken();
    return res.status(200).send({
        id:user._id,
        token:token,
        firstName:user.firstName,
        lastName:user.lastName,
        role:user.role,
        store:user.store,
        isAccountVerified:user.isAccountVerified
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
        store:user.store,
    })
})


/**---------------------------------
 * @desc verify user account 
 * @route /api/auth/:userId/verify/:token
 * @resquest get
 * @acess public
 ------------------------------------*/
 const verifyUserAccount=asyncHandler(async (req,res)=>{
    const userConnection=await getConnection('Users');
    const userModel= userConnection.model('User',User.schema);
    const user=await userModel.findById(req.params.userId);
    if(!user){
        return res.status(400).send("invalid link");
    }
    const VerificationToken=userConnection.models.VerificationTokenModel||userConnection.model('VerificationToken',VerificationTokenModel.schema);

    const verificationToken= await VerificationToken.findOne({
        userId:user._id,
        token:req.params.token
    })
    
    if(!verificationToken){
        return res.status(400).send("invalid link");
    }
    user.isAccountVerified=true;
    await user.save();
    const result=await VerificationToken.findByIdAndDelete({ _id: verificationToken._id });
    res.status(200).send("Your account is now verified")
})

module.exports={registerUser,loginUser,regenrateTokenForSuperAdmin,verifyUserAccount};