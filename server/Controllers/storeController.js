const mongoose=require('mongoose');
const bycrypt=require('bcrypt');
const asyncHandler=require('express-async-handler');
const { validateStore, Store } = require('../Models/Store');
const { User } = require('../Models/User');



/**---------------------------------
 * @desc create new store 
 * @route /api/stores
 * @request Post
 * @access public
 ------------------------------------*/
 const createStore = asyncHandler(async (req, res) => {
    const { error } = validateStore(req.body);
    if (error) return res.status(401).send(error.details[0].message);
    const connection = mongoose.createConnection(`${process.env.DB_URI_P1}Users${process.env.DB_URI_P2}`);
    const sanitizedStoreName = req.body.storeName.replace(/ /g, '_');
    /*const connection = await mongoose.createConnection(
        `${process.env.DB_URI_P1 + sanitizedStoreName + process.env.DB_URI_P2}`,      
    );*/
    const StoreModel = connection.model('Store', Store.schema);
    const store = await StoreModel.create({
        storeName: req.body.storeName,
        address: req.body.address,
        description: req.body.description,
        database: `${process.env.DB_URI_P1 + sanitizedStoreName + process.env.DB_URI_P2}`,
        user: req.body.user
    });  
    const UserModel = connection.model('User', User.schema);
    await UserModel.findByIdAndUpdate(req.body.user, {
        $set: {
            store: store._id
        }
    });
    
    return res.status(201).send(store);
});

module.exports = { createStore };