const asyncHandler=require('express-async-handler');
const { validateCreateCategory, Category, validateUpdateCategory } = require('../Models/Category');
const { Store } = require('../Models/Store');
const { getConnection } = require('../Utils/dbconnection');
const { Product } = require('../Models/Product');
const { SubCategory } = require('../Models/SubCategory');
const { Coupon } = require('../Models/Coupon');
const { OrderDetails } = require('../Models/OrderDetails');

/**---------------------------------
 * @desc create new category 
 * @route /api/categories/:storeId
 * @request Post
 * @access for only admin or super admin
-------------------------------------*/
const createCategory=asyncHandler(async(req,res)=>{
    const {error}=validateCreateCategory(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const CategoryModel=req.storeDb.models.Category || req.storeDb.model('Category', Category.schema);
    const category=await CategoryModel.create({
        categoryName:req.body.categoryName,
        categoryDescription:req.body.categoryDescription
    })
    return res.status(201).send(category);

})

/**---------------------------------
 * @desc get all categories
 * @route /api/categories
 * @request Get
 * @access public
-------------------------------------*/
const getAllCategories=asyncHandler(async(req,res)=>{
    const CategoryModel=req.storeDb.model('Category',Category.schema);
   
    const categoryies=await CategoryModel.find().sort({createdAt:-1});
    return res.status(200).send(categoryies)
})

/**---------------------------------
 * @desc get category number 
 * @route /api/categories/count
 * @request Get
 * @access public
-------------------------------------*/
const getCategoriesNumber=asyncHandler(async(req,res)=>{
    const CategoryModel=req.storeDb.model('Category',Category.schema);
    const count=await CategoryModel.countDocuments();
    return res.status(200).send({count:count})
})
/**---------------------------------
 * @desc get top 5 selling categories 
 * @route /api/categories/top
 * @request Get
 * @access for only admin or super admin
 ------------------------------------*/

 const getTopSellingCategories = asyncHandler(async (req, res) => {    
    const ProductModel = req.storeDb.model('Product', Product.schema);
    const OrderDetailsModel = req.storeDb.model('OrderDetails', OrderDetails.schema);
    const CategoryModel = req.storeDb.model('Category', Category.schema);

    const topCategories = await OrderDetailsModel.aggregate([
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
                _id: '$product.category', 
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
                from: 'categories',
                localField: '_id',
                foreignField: '_id',
                as: 'category'
            }
        },
        {
            $unwind: '$category'
        },
        {
            $project: {
                categoryName: '$category.categoryName',
                totalQuantitySold: 1
            }
        }
    ]);

    return res.status(200).send(topCategories);
});
/**---------------------------------
 * @desc update category 
 * @route /api/categories/:storeId/:categoryId
 * @request Put
 * @access only admin and super admin
 ------------------------------------*/

 const updateCategory=asyncHandler(async(req,res)=>{
    const {error}=validateUpdateCategory(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const CategoryModel=req.storeDb.model('Category',Category.schema);
    let category=await CategoryModel.findById(req.params.categoryId);
    if(!category) return res.status(404).send("Product not found");
    const newCategory=req.body;
    category=await CategoryModel.findByIdAndUpdate(req.params.categoryId,
        {$set:newCategory},
        {new:true}
    );
    return res.status(201).send(category);
    

})


/**---------------------------------
 * @desc delete category 
 * @route /api/categories/:storeId/:categoryId
 * @request delete
 * @access only admin and super admin
 ------------------------------------*/

const deleteCategory=asyncHandler(async(req,res)=>{
  
    const CategoryModel=req.storeDb.model('Category',Category.schema);
    let category=await CategoryModel.findById(req.params.categoryId);
    if(!category) return res.status(404).send("Category not found");
    const ProductModel=req.storeDb.model('Product',Product.schema);
    const SubCategoryModel=req.storeDb.model('SubCategory',SubCategory.schema);
    const CouponModel=req.storeDb.model('Coupon',Coupon.schema);
    for(const productId of category.product ){
        const product=await ProductModel.findById(productId);
        if(product){
            const subcategory=await SubCategoryModel.findById(product.subCategory);
            if(subcategory){
                subcategory.product=subcategory.product.filter(p => p.toString() !==productId.toString());
                req.store.product= req.store.product.filter(p => p.toString()!==productId.toString());
                await  req.store.save();
                await subcategory.save();
                
            }
            await ProductModel.findByIdAndDelete(productId);
        }
    }
    await CouponModel.updateMany(
        { category: category._id },
        { $pull: { category: category._id } }
    );
   
    await CategoryModel.findByIdAndDelete(category._id);
    return res.status(200).send("Category deleted successfully");
})



module.exports={createCategory,getAllCategories,updateCategory,deleteCategory,getTopSellingCategories,getCategoriesNumber}