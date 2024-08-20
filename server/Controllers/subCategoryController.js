const asyncHandler=require('express-async-handler');
const { validateCreateSubCategory, SubCategory, validateUpdateSubCategory } = require('../Models/SubCategory');
const { Store } = require('../Models/Store');
const { getConnection } = require('../Utils/dbconnection');
const { Product } = require('../Models/Product');
const { Category } = require('../Models/Category');
const { Coupon } = require('../Models/Coupon');
const { OrderDetails } = require('../Models/OrderDetails');

/**---------------------------------
 * @desc create new subSubCategory 
 * @route /api/categories
 * @request Post
 * @access for only admin or super admin
-------------------------------------*/
const createSubCategory=asyncHandler(async(req,res)=>{
    const {error}=validateCreateSubCategory(req.body);
    if(error) return res.status(400).send(error.details[0].message);
   
    const SubCategoryModel=req.storeDb.model('SubCategory',SubCategory.schema);
    const subSubCategory=await SubCategoryModel.create({
        subCategoryName:req.body.subCategoryName,
        subCategoryDescription:req.body.subCategoryDescription
    })
    return res.status(201).send(subSubCategory);

})

/**---------------------------------
 * @desc get all subSubCategories
 * @route /api/categories/:storeId
 * @request Get
 * @access public
-------------------------------------*/
const getAllSubCategories=asyncHandler(async(req,res)=>{
    
    const SubCategoryModel=req.storeDb.model('SubCategory',SubCategory.schema);
   
    const subCategories=await SubCategoryModel.find().sort({createdAt:-1});

    return res.status(200).send(subCategories)
})
/**---------------------------------
 * @desc get subcategory number 
 * @route /api/subCategories/count
 * @request Get
 * @access public
-------------------------------------*/
const getSubCategoriesNumber=asyncHandler(async(req,res)=>{
    const SubCategoryModel=req.storeDb.model('SubCategory',SubCategory.schema);
    const count=await SubCategoryModel.countDocuments();
    return res.status(200).send({count:count})
})


/**---------------------------------
 * @desc get top 5 selling subcategories 
 * @route /api/categories/top
 * @request Get
 * @access for only admin or super admin
 ------------------------------------*/

 const getTopSellingSubCategories = asyncHandler(async (req, res) => {    
    const ProductModel = req.storeDb.model('Product', Product.schema);
    const OrderDetailsModel = req.storeDb.model('OrderDetails', OrderDetails.schema);
    const SubCategoryModel = req.storeDb.model('SubCategory', SubCategory.schema);

    const topSubCategories = await OrderDetailsModel.aggregate([
        {
            $lookup: {
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'product'
            }
        },
        {
            $unwind: '$product'
        },
        {
            $group: {
                _id: '$product.subCategory', 
                totalQuantitySold: { $sum: '$quantity' }
            }
        },
        {
            $sort: { totalQuantitySold: -1 }
        },
        {
            $limit: 5
        },
        {
            $lookup: {
                from: 'subcategories',
                localField: '_id',
                foreignField: '_id',
                as: 'subCategory'
            }
        },
        {
            $unwind: '$subCategory'
        },
        {
            $project: {
                subCategoryName: '$subCategory.subCategoryName',
                totalQuantitySold: 1
            }
        }
    ]);

    return res.status(200).send(topSubCategories);
});



/**---------------------------------
 * @desc get single subcategory 
 * @route /api/subcategories/:storeId/:subCategoryId
 * @request Get
 * @access public
 ------------------------------------*/
 const getSingleSubCategory=asyncHandler(async(req,res)=>{
    
    const SubCategortyModel=req.storeDb.model('SubCategory',SubCategory.schema);
    req.storeDb.model('Product',Product.schema);
    const subCategory=await SubCategortyModel.findById(req.params.subCategoryId).populate({
        path:'product',
        ref:'Product',
        select:"-category -subCategory -store"
    });
    if(!subCategory) return res.status(404).send("SubCategory not found");
    return res.status(200).send(subCategory);
})

/**---------------------------------
 * @desc update category 
 * @route /api/categories/:storeId/:subCategoryId
 * @request Put
 * @access only admin and super admin
 ------------------------------------*/

 const updateSubCategory=asyncHandler(async(req,res)=>{
    const {error}=validateUpdateSubCategory(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const SubCategoryModel=req.storeDb.model('SubCategory',SubCategory.schema);
    let subCategory=await SubCategoryModel.findById(req.params.subCategoryId);
    if(!subCategory) return res.status(404).send("SubCategory not found");
    const newSubCategory=req.body;
    subCategory=await SubCategoryModel.findByIdAndUpdate(req.params.subCategoryId,
        {$set:newSubCategory},
        {new:true}
    );
    return res.status(201).send(subCategory);
    

})

/**---------------------------------
 * @desc delete category 
 * @route /api/categories/:storeId/:subCategoryId
 * @request delete
 * @access only admin and super admin
 ------------------------------------*/

 const deleteSubCategory=asyncHandler(async(req,res)=>{
   
    const SubCategoryModel=req.storeDb.model('SubCategory',SubCategory.schema);
    let subcategory=await SubCategoryModel.findById(req.params.subCategoryId);
    if(!subcategory) return res.status(404).send("SubCategory not found");
    const ProductModel=req.storeDb.model('Product',Product.schema);
    const CouponModel=req.storeDb.model('Coupon',Coupon.schema);
    const CategoryModel=req.storeDb.model('Category',Category.schema);
    for(const productId of subcategory.product ){
        const product=await ProductModel.findById(productId);
        if(product){
            const category=await CategoryModel.findById(product.category);
            if(category){
                category.product=category.product.filter(p => p.toString() !==productId.toString());
                req.store.product=req.store.product.filter(p => p.toString()!==productId.toString());
                await req.store.save();
                await category.save();
                
            }
            await ProductModel.findByIdAndDelete(productId);
        }
    }
    await CouponModel.updateMany(
        {subcategory:subcategory._id},
        {$pull:{subcategory:subcategory._id}}
    )
    
    await SubCategoryModel.findByIdAndDelete(subcategory._id);
    return res.status(200).send("SubCategory deleted successfully");
})


module.exports={createSubCategory,getAllSubCategories,getSingleSubCategory,updateSubCategory,deleteSubCategory,getTopSellingSubCategories,getSubCategoriesNumber}