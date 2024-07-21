const mongoose = require("mongoose");
const express = require('express');
const cors= require('cors');
const bodyParser=require('body-parser');
const { authRoute } = require("./Routes/authRoutes");
const { storeRoute } = require("./Routes/storeRoutes");
const { usersRoutes } = require("./Routes/usersRoutes");
const { productRoutes } = require("./Routes/productRoutes");
const { categoryRoute } = require("./Routes/categoryRoutes");
const { subCategoryRoute } = require("./Routes/subCategoryRoutes");
require('dotenv').config();


const { getConnection, initializeConnections, redisClient } = require('./Utils/dbconnection');

const app=express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
const port = process.env.PORT || 3002;

redisClient.on('ready', async () => {
  try {
    await initializeConnections();
    console.log('All existing connections initialized');
  } catch (err) {
    console.error('Error initializing connections:', err);
  }

  app.use('/api/auth', authRoute);
  app.use('/api/stores', storeRoute);
  app.use('/api/users', usersRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoute);
  app.use('/api/subcategories', subCategoryRoute);

  app.listen(port, () => console.log(`http://localhost:${port}`));
});

redisClient.connect();