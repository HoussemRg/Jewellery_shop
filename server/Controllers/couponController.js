const asyncHandler=require('express-async-handler');
const { Store } = require('../Models/Store');
const { Category } = require('../Models/Category');
const { SubCategory } = require('../Models/SubCategory');
const { Product } = require('../Models/Product');
const { Coupon, validateCreateCoupon, validateUpdateCoupon } = require('../Models/Coupon');
const { getConnection } = require('../Utils/dbconnection');
const { populate } = require('dotenv');


/**---------------------------------
 * @desc create new coupon 
 * @route /api/coupons/create
 * @request Post
 * @access for only admin or super admin
 ------------------------------------*/

 const createCoupon=asyncHandler(async(req,res)=>{
    const {error}=validateCreateCoupon(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const ProductModel=req.storeDb.model('Product',Product.schema);
    const CategoryModel=req.storeDb.model('Category',Category.schema);
    const SubCategoryModel=req.storeDb.model('SubCategory',SubCategory.schema);
    const CouponModel=req.storeDb.model('Coupon',Coupon.schema);
    const coupon =await CouponModel.create({
        couponName:req.body.couponName,
        startDate:req.body.startDate,
        expirationDate:req.body.expirationDate,
        discountRate:req.body.discountRate,
        type:req.body.type
    });
    if(req.body.product){
        const product=await ProductModel.findById(req.body.product);
        if(!product) return res.status(400).send('product not found');
        product.coupon.push(coupon._id);
        await product.save();
        coupon.product.push(req.body.product);
        

    }
    if(req.body.category){
        const category=await CategoryModel.findById(req.body.category);
        if(!category) return res.status(400).send('category not found');
        category.coupon.push(coupon._id);
        await category.save();
        coupon.category.push(req.body.category);
        
    }
    if(req.body.subCategory){
        const subCategory=await SubCategoryModel.findById(req.body.subCategory);
        if(!subCategory) return res.status(400).send('Sub-Category not found');
        subCategory.coupon.push(coupon._id);
        await subCategory.save();
        coupon.subCategory.push(req.body.subCategory);
        
    }
    await coupon.save();
    return res.status(201).send(coupon);
 })

 /**---------------------------------
 * @desc get all coupons 
 * @route /api/coupons
 * @request Get
 * @access public
 ------------------------------------*/
const getAllCoupons=(async(req,res)=>{
   
    const CouponModel=req.storeDb.models.Coupon || req.storeDb.model('Coupon', Coupon.schema);
    const coupons=await CouponModel.find().sort({createdAt:-1});
    res.status(200).send(coupons);
 })

 
 /**---------------------------------
 * @desc update single coupon 
 * @route /api/coupons/:couponId
 * @resquest Put
 * @acess only admin or super admin
 ------------------------------------*/

 const updateCoupon=asyncHandler(async(req,res)=>{
    const {error}=validateUpdateCoupon(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const couponId=req.params.couponId;
    const CouponModel=req.storeDb.models.Coupon || req.storeDb.model('Coupon', Coupon.schema);
    let coupon=await CouponModel.findById(couponId);
    if(!coupon) return res.status(400).send("Coupon not found");
    let newCoupon=req.body;
    newCoupon=await CouponModel.findByIdAndUpdate(couponId,
        {$set:newCoupon},
        {new:true}
    );
    res.status(201).send(newCoupon);
 })
/**---------------------------------
 * @desc delete  coupon 
 * @route /api/coupon/:couponId
 * @resquest delete
 * @acess only admin or super admin
 ------------------------------------*/

 const deleteCoupon=asyncHandler(async(req,res)=>{
    const couponId=req.params.couponId;
    
    const CouponModel=req.storeDb.models.Coupon || req.storeDb.model('Coupon', Coupon.schema);
    const ProductModel=req.storeDb.model('Product',Product.schema);
    const CategoryModel=req.storeDb.model('Category',Category.schema);
    const SubCategoryModel=req.storeDb.model('SubCategory',SubCategory.schema);
    const coupon=await CouponModel.findById(couponId);
    if (!coupon) return res.status(400).send("Coupon not found");
    
    if (coupon.product.length > 0) {
        await ProductModel.updateMany(
            { _id: { $in: coupon.product } },
            { $pull: { coupon: coupon._id } }
        );
    }

    if (coupon.category.length > 0) {
        await CategoryModel.updateMany(
            { _id: { $in: coupon.category } },
            { $pull: { coupon: coupon._id } }
        );
    }

    if (coupon.subCategory.length > 0) {
        await SubCategoryModel.updateMany(
            { _id: { $in: coupon.subCategory } },
            { $pull: { coupon: coupon._id } }
        );
    }

    
    await CouponModel.findByIdAndDelete(couponId);
    return res.status(200).send('coupon deleted successfully');
 })
/**---------------------------------
 * @desc apply  coupon 
 * @route /api/coupon/apply/:couponId/:itemId
 * @resquest post
 * @acess only admin or super admin
 ------------------------------------*/
 const applyCoupon=asyncHandler(async(req,res)=>{
    const {couponId,itemId}=req.params;
    const CouponModel=req.storeDb.models.Coupon || req.storeDb.model('Coupon', Coupon.schema);
    const ProductModel=req.storeDb.model('Product',Product.schema);
    const CategoryModel=req.storeDb.model('Category',Category.schema);
    const SubCategoryModel=req.storeDb.model('SubCategory',SubCategory.schema);
    
    
    const coupon = await  CouponModel.findById(couponId);

    if (!coupon) return res.status(400).send("Coupon not found");
   
    const couponType=coupon.type;
    let updateOperations = [];
    switch (couponType) {
        case 'product':
            const product=await ProductModel.findById(itemId)
            if (!product) return res.status(404).send("Product not found");
            updateOperations.push(ProductModel.findByIdAndUpdate(
                itemId,
                { $addToSet: { coupon: couponId } }
            ));
            updateOperations.push(CouponModel.findByIdAndUpdate(
                couponId,
                { $addToSet: { product: itemId } }
            ));
            break;
        case 'category':
            const category=await CategoryModel.findById(itemId)
            if (!category) return res.status(404).send("Category not found");
            updateOperations.push(CategoryModel.findByIdAndUpdate(
                itemId,
                { $addToSet: { coupon: couponId } }
            ));
            updateOperations.push(CouponModel.findByIdAndUpdate(
                couponId,
                { $addToSet: { category: itemId } }
            ));
            break;
        case 'subCategory':
            const subCategory=await SubCategoryModel.findById(itemId)
            if (!subCategory) return res.status(404).send("SubCategory not found");
            updateOperations.push(SubCategoryModel.findByIdAndUpdate(
                itemId,
                { $addToSet: { coupon: couponId } }
            ));
            updateOperations.push(CouponModel.findByIdAndUpdate(
                couponId,
                { $addToSet: { subCategory: itemId } }
            ));
            break;
        default:
            return res.status(400).send("Invalid coupon type");
    }
    await Promise.all(updateOperations);

    return res.status(200).send('Coupon applied successfully');
 })

 /**---------------------------------
 * @desc apply  coupon 
 * @route /api/coupon/filter/:couponType
 * @resquest GET
 * @acess only admin or super admin
 ------------------------------------*/
 const getCouponsPerType=asyncHandler(async(req,res)=>{
    const {couponType}=req.params;
    const validTypes = ['product', 'category', 'subCategory'];
    if (!validTypes.includes(couponType)) {
        return res.status(422).send("Invalid coupon type");
    }
    const CouponModel=req.storeDb.models.Coupon || req.storeDb.model('Coupon', Coupon.schema);
    const coupons=await CouponModel.find({type:couponType,expirationDate:{$gte:new Date()},startDate:{$lte:new Date()}}).select('_id couponName');
    res.status(200).send(coupons);
 })
 module.exports={createCoupon,getAllCoupons,updateCoupon,applyCoupon,deleteCoupon,getCouponsPerType}