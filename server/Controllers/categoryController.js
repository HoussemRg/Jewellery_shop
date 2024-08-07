const asyncHandler=require('express-async-handler');
const { validateCreateCategory, Category, validateUpdateCategory } = require('../Models/Category');
const { Store } = require('../Models/Store');
const { getConnection } = require('../Utils/dbconnection');
const { Product } = require('../Models/Product');
const { SubCategory } = require('../Models/SubCategory');

/**---------------------------------
 * @desc create new category 
 * @route /api/categories/:storeId
 * @request Post
 * @access for only admin or super admin
-------------------------------------*/
const createCategory=asyncHandler(async(req,res)=>{
    const {error}=validateCreateCategory(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const storeConnection=await getConnection("Users");
    const StoreModel=storeConnection.models.Store || storeConnection.model('Store', Store.schema);
    let store= await StoreModel.findById(req.user.store);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=await getConnection(store.database);
    const CategoryModel=databaseConnection.models.Category || databaseConnection.model('Category', Category.schema);
    const category=await CategoryModel.create({
        categoryName:req.body.categoryName,
        categoryDescription:req.body.categoryDescription
    })
    return res.status(201).send(category);

})

/**---------------------------------
 * @desc create new category 
 * @route /api/categories
 * @request Get
 * @access public
-------------------------------------*/
const getAllCategories=asyncHandler(async(req,res)=>{
    const storeId=req.user.store;
    const storeConnection=await getConnection("Users");
    const StoreModel=storeConnection.model('Store',Store.schema);
    let store= await StoreModel.findById(storeId);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=await getConnection(store.database);
    const CategoryModel=databaseConnection.model('Category',Category.schema);
   
    const categoryies=await CategoryModel.find();
    const count=await CategoryModel.countDocuments();
    return res.status(200).send({categoryies,count})
})



/**---------------------------------
 * @desc update category 
 * @route /api/categories/:storeId/:categoryId
 * @request Put
 * @access only admin and super admin
 ------------------------------------*/

 const updateCategory=asyncHandler(async(req,res)=>{
    const {error}=validateUpdateCategory(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const storeId=req.user.store;
    const storeConnection=await getConnection("Users");
    const StoreModel=storeConnection.model('Store',Store.schema);
    let store= await StoreModel.findById(storeId);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=await getConnection(store.database);
    const CategoryModel=databaseConnection.model('Category',Category.schema);
    let category=await CategoryModel.findById(req.params.categoryId);
    if(!category) return res.status(400).send("Product not found");
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
    const storeId=req.user.store;
    const storeConnection=await getConnection("Users");
    const StoreModel=storeConnection.model('Store',Store.schema);
    let store= await StoreModel.findById(storeId);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=await getConnection(store.database);
    const CategoryModel=databaseConnection.model('Category',Category.schema);
    let category=await CategoryModel.findById(req.params.categoryId);
    if(!category) return res.status(400).send("Category not found");
    const ProductModel=databaseConnection.model('Product',Product.schema);
    const SubCategoryModel=databaseConnection.model('SubCategory',SubCategory.schema);
    for(const productId of category.product ){
        const product=await ProductModel.findById(productId);
        if(product){
            const subcategory=await SubCategoryModel.findById(product.subCategory);
            if(subcategory){
                subcategory.product=subcategory.product.filter(p => p.toString() !==productId.toString());
                store.product=store.product.filter(p => p.toString()!==productId.toString());
                await store.save();
                await subcategory.save();
                await ProductModel.findByIdAndDelete(productId);
            }
        }
    }
    
    
    await CategoryModel.findByIdAndDelete(category._id);
    return res.status(200).send("Category deleted successfully");
})



module.exports={createCategory,getAllCategories,updateCategory,deleteCategory}