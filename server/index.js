const mongoose = require("mongoose");
const express = require('express');
const cors= require('cors');
const bodyParser=require('body-parser');
require('dotenv').config();
const app=express();



app.use(express.json);
app.use(bodyParser.urlencoded({extended:true}));
const port = process.env.PORT || 3002;
mongoose.connect(process.env.DB_URI).then(
    app.listen(port,()=> console.log(`http://localhost:${port}`))
).catch((err)=>console.log(err));
