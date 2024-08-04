const asyncHandler=require('express-async-handler');
const mongoose=require('mongoose');
const { getConnection, connections } = require('../Utils/dbconnection');
const { Store } = require('../Models/Store');
const { Client,validateCreateClient, validateUpdateClient } = require('../Models/client');
const { Order } = require('../Models/Order');

/**---------------------------------
 * @desc create new client 
 * @route /api/clients/create
 * @resquest Post
 * @acess only admin or superAdmin
 ------------------------------------*/
const createClient=asyncHandler(async(req,res)=>{
    const {error}=validateCreateClient(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const storeId=req.user.store;
    const storeConnection=await getConnection("Users");
    const StoreModel=storeConnection.models.Store || storeConnection.model('Store', Store.schema);
    let store= await StoreModel.findById(storeId);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=await getConnection(store.database);
    const ClientModel=databaseConnection.models.Client || databaseConnection.model('Client', Client.schema);
    let client=await ClientModel.findOne({email:req.body.email});
    if(client) return res.status(400).send('Client already exists');
    client=await ClientModel.create({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        cin:req.body.cin,
        email:req.body.email,
        address:req.body.address,
        phoneNumber:req.body.phoneNumber,
    });
    return res.status(201).send(client);
})
/**---------------------------------
 * @desc get all clients
 * @route /api/clients
 * @resquest Get
 * @acess only admin or superAdmin
 ------------------------------------*/
const getAllClients=asyncHandler(async(req,res)=>{
    const storeId = req.user.store;
    
    const storeConnection = await getConnection("Users");
    const StoreModel = storeConnection.model('Store', Store.schema);
    let store = await StoreModel.findById(storeId);
    if (!store) return res.status(400).send("Store not found");
    const databaseConnection=await getConnection(store.database);
    const ClientModel=databaseConnection.models.Client || databaseConnection.model('Client', Client.schema);
    const clients=await ClientModel.find().select('-order');
    const count=await ClientModel.countDocuments();
    res.status(200).send({clients:clients,count:count});
 })
/**---------------------------------
 * @desc get single client 
 * @route /api/clients/:clientId
 * @resquest Get
 * @acess only admin or superAdmin
 ------------------------------------*/
 const getSingleClient=(asyncHandler(async(req,res)=>{
    const storeId=req.user.store;
    const clientId=req.params.clientId;
    const storeConnection = await getConnection("Users");
    const StoreModel = storeConnection.model('Store', Store.schema);
    let store = await StoreModel.findById(storeId);
    if (!store) return res.status(400).send("Store not found");
    const databaseConnection=await getConnection(store.database);
    const ClientModel=databaseConnection.models.Client || databaseConnection.model('Client', Client.schema);
    databaseConnection.models.Order || databaseConnection.model('Order', Order.schema);
    const client=await ClientModel.findById(clientId).populate({
        path:'order',
        model:'Order',
        select: '_id totalAmount'
    });
    if(!client) return res.status(400).send("Client not found");
    return res.status(200).send(client);
}))


/**---------------------------------
 * @desc update single client 
 * @route /api/clients/:clientId
 * @resquest Put
 * @acess only admin or super admin
 ------------------------------------*/

 const updateClient=asyncHandler(async(req,res)=>{
    const {error}=validateUpdateClient(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const clientId=req.params.clientId;
    const storeId=req.user.store;
    const storeConnection = await getConnection("Users");
    const StoreModel = storeConnection.model('Store', Store.schema);
    let store = await StoreModel.findById(storeId);
    if (!store) return res.status(400).send("Store not found");
    const databaseConnection=await getConnection(store.database);
    const ClientModel=databaseConnection.models.Client || databaseConnection.model('Client', Client.schema);
    let client=await ClientModel.findById(clientId);
    if(!client) return res.status(400).send("Client not found");
    let newClient=req.body;
    newClient=await ClientModel.findByIdAndUpdate(clientId,
        {$set:newClient},
        {new:true}
    );
    res.status(201).send(newClient);
 })

 /**---------------------------------
 * @desc delete  client 
 * @route /api/clients/:clientId
 * @resquest delete
 * @acess only admin or super admin
 ------------------------------------*/
 const deleteClient=asyncHandler(async(req,res)=>{
    const clientId=req.params.clientId;
    const storeId=req.user.store;
    const storeConnection = await getConnection("Users");
    const StoreModel = storeConnection.model('Store', Store.schema);
    let store = await StoreModel.findById(storeId);
    if (!store) return res.status(400).send("Store not found");
    const databaseConnection=await getConnection(store.database);
    const ClientModel=databaseConnection.models.Client || databaseConnection.model('Client', Client.schema);
    await ClientModel.findByIdAndDelete(clientId);
    res.status(200).send("Client deleted successfully");
    
 })
module.exports={createClient,getAllClients,getSingleClient,updateClient,deleteClient};