const asyncHandler=require('express-async-handler');
const { User,validateRegisterUser } = require('../Models/User');
const mongoose=require('mongoose');



/**---------------------------------
 * @desc register / sign up new user 
 * @route /api/auth/register
 * @resquest Post
 * @acess public
 ------------------------------------*/

 const registerUser=asyncHandler(async(req,res)=>{
    const {error}=validateRegisterUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const userConnection=mongoose.createConnection(`${process.env.DB_URI_P1}Users${process.env.DB_URI_P2}`);
    const userModel= userConnection.model('User',User.schema);
    const user=await userModel.create({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        cin:req.body.cin,
        email:req.body.email,
        password:req.body.password,
        address:req.body.address,
        phoneNumber:req.body.phoneNumber,
    })

    return res.status(201).send(user);
 })

 module.exports={registerUser}