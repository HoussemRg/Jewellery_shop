const asyncHandler=require('express-async-handler');
const { validateCreateSubCategory, SubCategory, validateUpdateSubCategory } = require('../Models/SubCategory');
const { Store } = require('../Models/Store');
const { getConnection } = require('../Utils/dbconnection');
const { Product } = require('../Models/Product');
const { Category } = require('../Models/Category');

/**---------------------------------
 * @desc create new subSubCategory 
 * @route /api/categories
 * @request Post
 * @access for only admin or super admin
-------------------------------------*/
const createSubCategory=asyncHandler(async(req,res)=>{
    const {error}=validateCreateSubCategory(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const storeConnection=await getConnection("Users");
    const StoreModel=storeConnection.model('Store',Store.schema);
    let store= await StoreModel.findById(req.user.store);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=await getConnection(store.database);
    const SubCategoryModel=databaseConnection.model('SubCategory',SubCategory.schema);
    const subSubCategory=await SubCategoryModel.create({
        subCategoryName:req.body.subCategoryName,
        subCategoryDescription:req.body.subCategoryDescription
    })
    return res.status(201).send(subSubCategory);

})

/**---------------------------------
 * @desc create new subSubCategory 
 * @route /api/categories/:storeId
 * @request Get
 * @access public
-------------------------------------*/
const getAllSubCategories=asyncHandler(async(req,res)=>{
    const storeId=req.user.store;
    const storeConnection=await getConnection("Users");
    const StoreModel=storeConnection.model('Store',Store.schema);
    let store= await StoreModel.findById(storeId);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=await getConnection(store.database);
    const SubCategoryModel=databaseConnection.model('SubCategory',SubCategory.schema);
   
    const subCategories=await SubCategoryModel.find().select("-product");
    const count=await SubCategoryModel.countDocuments();
    return res.status(200).send({subCategories,count})
})

/**---------------------------------
 * @desc get single subcategory 
 * @route /api/subcategories/:storeId/:subCategoryId
 * @request Get
 * @access public
 ------------------------------------*/
 const getSingleSubCategory=asyncHandler(async(req,res)=>{
    const storeId=req.user.store;
    const storeConnection=await getConnection("Users");
    const StoreModel=storeConnection.model('Store',Store.schema);
    let store= await StoreModel.findById(storeId);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=await getConnection(store.database);
    const SubCategortyModel=databaseConnection.model('SubCategory',SubCategory.schema);
    databaseConnection.model('Product',Product.schema);
    const subCategory=await SubCategortyModel.findById(req.params.subCategoryId).populate({
        path:'product',
        ref:'Product',
        select:"-category -subCategory -store"
    });
    if(!subCategory) return res.status(400).send("SubCategory not found");
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
    const storeId=req.user.store;
    const storeConnection=await getConnection("Users");
    const StoreModel=storeConnection.model('Store',Store.schema);
    let store= await StoreModel.findById(storeId);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=await getConnection(store.database);
    const SubCategoryModel=databaseConnection.model('SubCategory',SubCategory.schema);
    let subCategory=await SubCategoryModel.findById(req.params.subCategoryId);
    if(!subCategory) return res.status(400).send("SubCategory not found");
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
    const storeId=req.user.store;
    const storeConnection=await getConnection("Users");
    const StoreModel=storeConnection.model('Store',Store.schema);
    let store= await StoreModel.findById(storeId);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=await getConnection(store.database);
    const SubCategoryModel=databaseConnection.model('SubCategory',SubCategory.schema);
    let subcategory=await SubCategoryModel.findById(req.params.subCategoryId);
    if(!subcategory) return res.status(400).send("SubCategory not found");
    const ProductModel=databaseConnection.model('Product',Product.schema);
    const CategoryModel=databaseConnection.model('Category',Category.schema);
    for(const productId of subcategory.product ){
        const product=await ProductModel.findById(productId);
        if(product){
            const category=await CategoryModel.findById(product.category);
            if(category){
                category.product=category.product.filter(p => p.toString() !==productId.toString());
                store.product=store.product.filter(p => p.toString()!==productId.toString());
                await store.save();
                await category.save();
                await ProductModel.findByIdAndDelete(productId);
            }else{
                return res.status(400).send("you are trying to delete a product with a subcategory not found ");
            }
        }else{
            return res.status(400).send("you are trying to delete a product not found ");
        }
    }
    
    
    await SubCategoryModel.findByIdAndDelete(subcategory._id);
    return res.status(200).send("SubCategory deleted successfully");
})


module.exports={createSubCategory,getAllSubCategories,getSingleSubCategory,updateSubCategory,deleteSubCategory}