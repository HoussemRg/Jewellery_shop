const express=require('express');
const {registerUser , loginUser, regenrateTokenForSuperAdmin }=require('../Controllers/authController');
const {verifyTokenForOnlySuperAdmin} = require('../Middlewares/verifyToken');
const authRoute=express.Router();

authRoute.post('/register',registerUser);
authRoute.post('/login',loginUser);
authRoute.post('/regenerate-token',verifyTokenForOnlySuperAdmin,regenrateTokenForSuperAdmin);

module.exports={authRoute}