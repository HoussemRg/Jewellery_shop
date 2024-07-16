const express=require('express');
const {registerUser}=require('../Controllers/authController');
const authRoute=express.Router();

authRoute.post('/register',registerUser);

module.exports={authRoute}