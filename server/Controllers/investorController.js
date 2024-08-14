const asyncHandler=require('express-async-handler');
const mongoose=require('mongoose');


const { Investor,validateCreateInvestor, validateUpdateInvestor  } = require('../Models/Investor');
const { Investment } = require('../Models/investment');
const { Product } = require('../Models/Product');

/**---------------------------------
 * @desc create new investor 
 * @route /api/investors/create
 * @resquest Post
 * @acess only admin or superAdmin
 ------------------------------------*/
const createInvestor=asyncHandler(async(req,res)=>{
    const {error}=validateCreateInvestor(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const InvestorModel=req.storeDb.models.Investor || req.storeDb.model('Investor', Investor.schema);
    let investor=await InvestorModel.findOne({email:req.body.email});
    if(investor) return res.status(400).send('Investor already exists');
    investor=await InvestorModel.create({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        cin:req.body.cin,
        email:req.body.email,
        address:req.body.address,
        phoneNumber:req.body.phoneNumber,
        
    });
    return res.status(201).send(investor);
})
/**---------------------------------
 * @desc get all investors
 * @route /api/investors
 * @resquest Get
 * @acess only admin or superAdmin
 ------------------------------------*/
const getAllInvestors=asyncHandler(async(req,res)=>{
 
    const InvestorModel=req.storeDb.models.Investor || req.storeDb.model('Investor', Investor.schema);
    const investors=await InvestorModel.find();
    const count=await InvestorModel.countDocuments();
    res.status(200).send({investors:investors,count:count});
 })
/**---------------------------------
 * @desc get single investor 
 * @route /api/investors/:investorId
 * @resquest Get
 * @acess only admin or superAdmin
 ------------------------------------*/
 const getSingleInvestor=(asyncHandler(async(req,res)=>{
    const investorId=req.params.investorId;
    
    const InvestorModel=req.storeDb.models.Investor || req.storeDb.model('Investor', Investor.schema);
    req.storeDb.models.Investment || req.storeDb.model('Investment', Investment.schema);
   
    const investor=await InvestorModel.findById(investorId).populate({
        path:'investment',
        model:'Investment',
        select:'-investor -createdAt -updatedAt',
        
        
    });
    if(!investor) return res.status(400).send("Investor not found");
    return res.status(200).send(investor);
}))


/**---------------------------------
 * @desc update single investor 
 * @route /api/investors/:investorId
 * @resquest Put
 * @acess only admin or super admin
 ------------------------------------*/

 const updateInvestor=asyncHandler(async(req,res)=>{
    const {error}=validateUpdateInvestor(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const investorId=req.params.investorId;
    
    const InvestorModel=req.storeDb.models.Investor || req.storeDb.model('Investor', Investor.schema);
    let investor=await InvestorModel.findById(investorId);
    if(!investor) return res.status(400).send("Investor not found");
    let newInvestor=req.body;
    newInvestor=await InvestorModel.findByIdAndUpdate(investorId,
        {$set:newInvestor},
        {new:true}
    );
    res.status(201).send(newInvestor);
 })

 /**---------------------------------
 * @desc delete  investor 
 * @route /api/investors/:investorId
 * @resquest delete
 * @acess only admin or super admin
 ------------------------------------*/
 const deleteInvestor=asyncHandler(async(req,res)=>{
    const investorId = req.params.investorId;
    
    const InvestorModel = req.storeDb.models.Investor || req.storeDb.model('Investor', Investor.schema);
    const InvestmentModel = req.storeDb.models.Investment || req.storeDb.model('Investment', Investment.schema);
    const ProductModel = req.storeDb.models.Product || req.storeDb.model('Product', Product.schema);

    const investor = await InvestorModel.findById(investorId);
    if (!investor) return res.status(400).send("Investor not found");

    const investments = await InvestmentModel.find({ investor: investor._id });

    if (investments.length > 0) {

        const productIds = investments.flatMap(investment => investment.product);

        await ProductModel.deleteMany({ _id: { $in: productIds } });


        await InvestmentModel.deleteMany({ investor: investor._id });
    }

    await InvestorModel.findByIdAndDelete(investorId);

    res.status(200).send("Investor deleted successfully");
    
 })
module.exports={createInvestor,getAllInvestors,getSingleInvestor,updateInvestor,deleteInvestor};