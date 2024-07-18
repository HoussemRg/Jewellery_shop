const mongoose=require('mongoose');
const bycrypt=require('bcrypt');
const asyncHandler=require('express-async-handler');
const { validateStore, Store } = require('../Models/Store');
const { User } = require('../Models/User');
const { getConnection, connections } = require('../Utils/dbconnection');
const { createDatabase } = require('../Utils/dbcreating');



/**---------------------------------
 * @desc create new store 
 * @route /api/stores
 * @request Post
 * @access public
 ------------------------------------*/
 const createStore = asyncHandler(async (req, res) => {
    const { error } = validateStore(req.body);
    if (error) return res.status(401).send(error.details[0].message);
    const connection = getConnection('Users');
    const sanitizedStoreName = req.body.storeName.replace(/ /g, '_');
    
    const StoreModel = connection.model('Store', Store.schema);
    let store=await StoreModel.findOne({storeName:req.body.storeName});
    if(store) return res.status(400).send("Store alreadt exists");
    store = await StoreModel.create({
        storeName: req.body.storeName,
        address: req.body.address,
        description: req.body.description,
        database: `${ sanitizedStoreName}`,
        
    });  
    const newDatabase =mongoose.createConnection(
        `${process.env.DB_URI_P1}${sanitizedStoreName}${process.env.DB_URI_P2}`,      
    );
    console.log(newDatabase);
    //createDatabase(sanitizedStoreName);
    
    return res.status(201).send(store);
});

module.exports = { createStore };