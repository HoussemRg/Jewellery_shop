const asyncHandler=require('express-async-handler');
const mongoose=require('mongoose');
const { Investor  } = require('../Models/Investor');
const { Investment, validateCreateInvestment,validateUpdateInvestment } = require('../Models/investment');
const { Product } = require('../Models/Product');

/**---------------------------------
 * @desc create new investment 
 * @route /api/investments/create
 * @resquest Post
 * @acess only admin or superAdmin
 ------------------------------------*/

 const createInvestment=asyncHandler(async(req,res)=>{
    const {error}=validateCreateInvestment(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const InvestmentModel=req.storeDb.models.Investment || req.storeDb.model('Investment', Investment.schema);
    const investment=await InvestmentModel.create({
         investmentName:req.body.investmentName,
        investor:req.body.investor,
        startDate:req.body.startDate,
        endDate:req.body.endDate,
        investmentAmount:req.body.investmentAmount,
    });
    const InvestorModel=req.storeDb.models.Investor || req.storeDb.model('Investor', Investor.schema);
    const investor=await InvestorModel.findById(investment.investor);
    investor.investment.push(investment._id);
    await investor.save();
    return res.status(201).send(investment);
 })

 /**---------------------------------
 * @desc get all investments 
 * @route /api/investments
 * @resquest get
 * @acess only admin or superAdmin
 ------------------------------------*/

 const getAllInvestments=asyncHandler(async(req,res)=>{
    const InvestmentModel=req.storeDb.models.Investment || req.storeDb.model('Investment', Investment.schema);
    req.storeDb.models.Investor || req.storeDb.model('Investor', Investor.schema);
    const investments=await InvestmentModel.find().populate({
      path:'investor',
      model:'Investor',
      select:'-investment'
      
  });

    return res.status(200).send(investments);
 })

 
 /**---------------------------------
 * @desc get all investments per investor 
 * @route /api/investments
 * @resquest get
 * @acess only admin or superAdmin
 ------------------------------------*/

 const getAllInvestmentsPerInvestor=asyncHandler(async(req,res)=>{
   const {investorId}=req.params;
   const InvestmentModel=req.storeDb.models.Investment || req.storeDb.model('Investment', Investment.schema);
   const InvestorModel=req.storeDb.models.Investor || req.storeDb.model('Investor', Investor.schema);
   const investor=await InvestorModel.findById(investorId);
   if(!investor) return res.status(400).send('Investor not found');
   const investments=await InvestmentModel.find({investor:investor._id}).populate({
     path:'investor',
     model:'Investor',
     select:'-investment'
     
 });

   return res.status(200).send(investments);
})


 /**---------------------------------
 * @desc get single investment
 * @route /api/investments/:investmentId
 * @resquest get
 * @acess only admin or superAdmin
 ------------------------------------*/

 const getSingleInvestment=asyncHandler(async(req,res)=>{
    const investmentId=req.params.investmentId;
    const InvestmentModel=req.storeDb.models.Investment || req.storeDb.model('Investment', Investment.schema);
    req.storeDb.models.Investor || req.storeDb.model('Investor', Investor.schema);
    req.storeDb.models.Product || req.storeDb.model('Product', Product.schema);
    const investment=await InvestmentModel.findById(investmentId).populate(
      [{
      path:'investor',
      model:'Investor',
      select:'-investment'
      
      },
      {
         path:'product',
         model:'Product',
         select:'_id productName purchasePrice stockQuantity '
      }
   ]);
    if(!investment) return res.status(400).send('Investment not found');

    return res.status(201).send(investment);
 })

  /**---------------------------------
 * @desc update investment
 * @route /api/investments/:investmentId
 * @resquest put
 * @acess only admin or superAdmin
 ------------------------------------*/

 const updateInvestment=asyncHandler(async(req,res)=>{
   const {error}=validateUpdateInvestment(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const investmentId=req.params.investmentId;
    const InvestmentModel=req.storeDb.models.Investment || req.storeDb.model('Investment', Investment.schema);
    let investment=await InvestmentModel.findById(investmentId);
    if(!investment) return res.status(400).send('Investment not found');
    const newInvestment=req.body;
    investment=await InvestmentModel.findByIdAndUpdate(
        investmentId,
        { $set: newInvestment },
        { new: true }
    )
    return res.status(201).send(investment);
 })

  /**---------------------------------
 * @desc delete investment
 * @route /api/investments/:investmentId
 * @resquest delete
 * @acess only admin or superAdmin
 ------------------------------------*/

 const deleteInvestment=asyncHandler(async(req,res)=>{
    const investmentId=req.params.investmentId;
    const InvestmentModel=req.storeDb.models.Investment || req.storeDb.model('Investment', Investment.schema);
    const InvestorModel=req.storeDb.models.Investor || req.storeDb.model('Investor', Investor.schema);
    const ProductModel=req.storeDb.models.Product || req.storeDb.model('Product', Product.schema);
    let investment=await InvestmentModel.findById(investmentId);
    if(!investment) return res.status(400).send('Investment not found');
    await InvestorModel.updateMany(
      { investment: investment._id },
      { $pull: { investment: investment._id } }
  );
    await ProductModel.deleteMany({investment:investment._id});
    
    await InvestmentModel.findByIdAndDelete(investmentId);
    return res.status(200).send('investment deleted successfully');
 })



 module.exports={createInvestment,getAllInvestments,getSingleInvestment,deleteInvestment,updateInvestment,getAllInvestmentsPerInvestor};

 