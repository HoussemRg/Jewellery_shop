const express=require('express');
const { createStore } = require('../Controllers/storeController');

const storeRoute=express.Router();

storeRoute.post('/create',createStore);

module.exports={storeRoute}