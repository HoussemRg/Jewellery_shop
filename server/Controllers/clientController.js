const asyncHandler=require('express-async-handler');
const mongoose=require('mongoose');
const { getConnection, connections } = require('../Utils/dbconnection');
const { Store } = require('../Models/Store');
const { Client,validateCreateClient, validateUpdateClient } = require('../Models/client');
const { Order } = require('../Models/Order');
const { OrderDetails } = require('../Models/OrderDetails');

/**---------------------------------
 * @desc create new client 
 * @route /api/clients/create
 * @resquest Post
 * @acess only admin or superAdmin
 ------------------------------------*/
const createClient=asyncHandler(async(req,res)=>{
    const {error}=validateCreateClient(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const ClientModel=req.storeDb.models.Client || req.storeDb.model('Client', Client.schema);
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
 
    const ClientModel=req.storeDb.models.Client || req.storeDb.model('Client', Client.schema);
    const clients=await ClientModel.find().sort({createdAt:-1}).select('-order');
    res.status(200).send(clients);
 })

  /**---------------------------------
 * @desc get  clients number
 * @route /api/clients/count
 * @request get
 * @access only admin or superAdmin
 ------------------------------------*/
 const getClientsNumber=asyncHandler(async(req,res)=>{
    const ClientModel = req.storeDb.models.Client || req.storeDb.model('Client', Client.schema);
    const count=await ClientModel.countDocuments();
    res.status(200).send({count:count});
 })
/**---------------------------------
 * @desc get single client 
 * @route /api/clients/:clientId
 * @resquest Get
 * @acess only admin or superAdmin
 ------------------------------------*/
 const getSingleClient=(asyncHandler(async(req,res)=>{
    const clientId=req.params.clientId;
    
    const ClientModel=req.storeDb.models.Client || req.storeDb.model('Client', Client.schema);
    req.storeDb.models.Order || req.storeDb.model('Order', Order.schema);
    const client=await ClientModel.findById(clientId).populate({
        path:'order',
        model:'Order',
        select: '_id totalAmount'
    });
    if(!client) return res.status(404).send("Client not found");
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
    
    const ClientModel=req.storeDb.models.Client || req.storeDb.model('Client', Client.schema);
    let client=await ClientModel.findById(clientId);
    if(!client) return res.status(404).send("Client not found");
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
    
    const ClientModel=req.storeDb.models.Client || req.storeDb.model('Client', Client.schema);
    const OrderModel=req.storeDb.models.Order || req.storeDb.model('Order', Order.schema);
    const OrderDetailsModel=req.storeDb.models.OrderDetails || req.storeDb.model('OrderDetails', OrderDetails.schema);
    const client=await ClientModel.findById(clientId);
    if (!client) return res.status(404).send("Client not found");
    const orders = await OrderModel.find({ client: client._id });

  for (let order of orders) {
    await OrderDetailsModel.deleteMany({ order: order._id });
  }

  await OrderModel.deleteMany({ client: client._id });

  await ClientModel.findByIdAndDelete(clientId);

  res.status(200).send("Client deleted successfully");
    
 })
module.exports={createClient,getAllClients,getSingleClient,updateClient,deleteClient,getClientsNumber};