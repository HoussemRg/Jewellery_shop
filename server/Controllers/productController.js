const asyncHandler=require('express-async-handler');
const { validateCreateProduct, Product, validateUpdateProduct } = require('../Models/Product');
const fs=require('fs');
const { getConnection } = require('../Utils/dbconnection');
const { Store } = require('../Models/Store');
const path = require('path');
const { Category } = require('../Models/Category');
const { SubCategory } = require('../Models/SubCategory');


/**---------------------------------
 * @desc create new product 
 * @route /api/products
 * @request Post
 * @access for only admin or super admin
 ------------------------------------*/
 const createProduct=asyncHandler(async(req,res)=>{
    const {error}=validateCreateProduct(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const storeConnection=await getConnection("Users");
    const StoreModel=storeConnection.model('Store',Store.schema);
    let store= await StoreModel.findById(req.user.store);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=await getConnection(store.database);
    const ProductModel=databaseConnection.model('Product',Product.schema);
    const CategoryModel=databaseConnection.model('Category',Category.schema);
    const SubCategoryModel=databaseConnection.model('SubCategory',SubCategory.schema);
    let category=await CategoryModel.findById(req.body.category);
    if(!category) return res.status(400).send("Category not found");
    let subCategory=await SubCategoryModel.findById(req.body.subCategory);
    if(!subCategory) return res.status(400).send("Category not found");
    let product=await ProductModel.create({
        productName:req.body.productName,
        description:req.body.description,
        carat:req.body.carat,
        weight:req.body.weight,
        productPhoto:req.file ? req.file.buffer : fs.readFileSync(path.join(__dirname,'../assets/productPhoto.jpg')),
        purchasePrice:req.body.purchasePrice,
        unitPrice:req.body.unitPrice,
        stockQuantity:req.body.stockQuantity,
        store:store._id,
        category:req.body.category,
        subCategory:req.body.subCategory
    });
    
    store.product.push(product._id);
    category.product.push(product._id);
    subCategory.product.push(product._id);
    await category.save();
    await subCategory.save();
    await store.save();
    return res.status(201).send(product);
 })

/**---------------------------------
 * @desc get all products for a store 
 * @route /api/products
 * @request Get
 * @access for only admin or super admin
 ------------------------------------*/

const getAllProducts=asyncHandler(async(req,res)=>{
    const storeId=req.user.store;
    const PRODUCTS_PER_PAGE=8;
    const {page}=req.query;
    
    const storeConnection=await getConnection("Users");
    const StoreModel=storeConnection.models.Store || storeConnection.model('Store', Store.schema);
    let store= await StoreModel.findById(storeId);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=await getConnection(store.database);
    const ProductModel=databaseConnection.models.Product || databaseConnection.model('Product', Product.schema);
    databaseConnection.models.Category || databaseConnection.model('Category', Category.schema);
    databaseConnection.models.SubCategory || databaseConnection.model('SubCategory', SubCategory.schema);
    const products=await ProductModel.find().sort({createdAt:-1}).skip((page-1)*PRODUCTS_PER_PAGE).limit(PRODUCTS_PER_PAGE).populate({
        path:'category',
        model:'Category',
        select:"-product"
    }).populate({
        path:'subCategory',
        model:'SubCategory',
        select:"-product"
    });
    return res.status(200).send(products)
})

/**---------------------------------
 * @desc get number of products 
 * @route /api/products/count
 * @request Get
 * @access for only admin or super admin
 ------------------------------------*/

 const getNumberOfProducts=asyncHandler(async(req,res)=>{
    const storeId=req.user.store;
    
    const storeConnection=await getConnection("Users");
    const StoreModel=storeConnection.model('Store',Store.schema);
    let store= await StoreModel.findById(storeId);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=await getConnection(store.database);
    const ProductModel=databaseConnection.model('Product',Product.schema);
    const count=await ProductModel.countDocuments();
    return res.status(200).send({count:count})
})


/**---------------------------------
 * @desc get single product 
 * @route /api/products/:productId
 * @request Get
 * @access public
 ------------------------------------*/
const getSingleProduct=asyncHandler(async(req,res)=>{
    const storeId=req.user.store;
    const storeConnection=await getConnection("Users");
    const StoreModel=storeConnection.model('Store',Store.schema);
    let store= await StoreModel.findById(storeId);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=await getConnection(store.database);
    const ProductModel=databaseConnection.model('Product',Product.schema);
    const product=await ProductModel.findById(req.params.productId);
    if(!product) return res.status(400).send("Product not found");
    return res.status(200).send(product);
})

/**---------------------------------
 * @desc update product 
 * @route /api/products/:storeId/:productId
 * @request Put
 * @access only admin and super admin
 ------------------------------------*/

 const updateProduct = asyncHandler(async (req, res) => {
    const { error } = validateUpdateProduct(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const storeId = req.user.store;
    const storeConnection = await getConnection("Users");
    const StoreModel = storeConnection.model('Store', Store.schema);
    let store = await StoreModel.findById(storeId);
    if (!store) return res.status(400).send("Store not found");

    const databaseConnection = await getConnection(store.database);
    const ProductModel = databaseConnection.model('Product', Product.schema);
    let product = await ProductModel.findById(req.params.productId);
    if (!product) return res.status(400).send("Product not found");

    
    const newProduct = { ...req.body };

    if (req.file) {
        newProduct.image = req.file.filename; 
    }

    product = await ProductModel.findByIdAndUpdate(
        req.params.productId,
        { $set: newProduct },
        { new: true }
    );

    return res.status(200).send(product);
});

/**---------------------------------
 * @desc delete product 
 * @route /api/products/:storeId/:productId
 * @request delete
 * @access only admin and super admin
 ------------------------------------*/
 const deleteProduct=asyncHandler(async(req,res)=>{
    const storeId=req.user.store;
    const storeConnection=await getConnection("Users");
    const StoreModel=storeConnection.model('Store',Store.schema);
    let store= await StoreModel.findById(storeId);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=await getConnection(store.database);
    const ProductModel=databaseConnection.model('Product',Product.schema);
    let product=await ProductModel.findById(req.params.productId);
    if(!product) return res.status(400).send("Product not found");
    store.product=store.product.filter(productId=> productId.toString() !== product._id.toString());  
    await store.save();
    await ProductModel.findByIdAndDelete(product._id);
    return res.status(200).send("Product deleted successfully");
})

const updateProductPhoto=asyncHandler(async(req,res)=>{
    if(!req.file){
        return res.status(400).send("No image provided");
    }
    const storeId=req.user.store;
    const storeConnection=await getConnection("Users");
    const StoreModel=storeConnection.model('Store',Store.schema);
    let store= await StoreModel.findById(storeId);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=await getConnection(store.database);
    const ProductModel=databaseConnection.model('Product',Product.schema);
    let product=await ProductModel.findById(req.params.productId);
    if(!product) return res.status(400).send("Product not found");
    product.productPhoto=req.file.buffer;
    product.save();
    const updatedProduct=await ProductModel.findById(req.params.productId);
    return res.status(201).send(updatedProduct);
})

/**---------------------------------
 * @desc filter products 
 * @route /api/products/filter
 * @request get
 * @access public
 ------------------------------------*/

const filterProducts=asyncHandler(async(req,res)=>{
    const storeId=req.user.store;
    const storeConnection=await getConnection("Users");
    const StoreModel=storeConnection.model('Store',Store.schema);
    let store= await StoreModel.findById(storeId);
    if(!store) return res.status(400).send("Store not found");
    const databaseConnection=await getConnection(store.database);
    const ProductModel=databaseConnection.model('Product',Product.schema);
    const {productName,categoryName,subCategoryName,carat,weight,stockQuantity,minPrice,maxPrice,page}=req.query;
    let matchConditions={};
    const PRODUCTS_PER_PAGE=8;
    if (!productName && !categoryName && !subCategoryName && !carat && !weight && !stockQuantity && !minPrice && !maxPrice) {
        return res.status(200).send({ products: [], count: 0 });
      }
    if(productName){
        matchConditions.productName={$regex:productName,$options:'i'};
    }
    if(carat){
        matchConditions.carat={...matchConditions.carat,$gte:Number(carat)};
    }
    if(weight){
        matchConditions.weight={...matchConditions.weight,$gte:Number(weight)};
    }
    if(stockQuantity){
        matchConditions.stockQuantity={...matchConditions.stockQuantity,$gte:Number(stockQuantity)};
    }
    if (minPrice) {
        matchConditions.minCalculatedPrice = { ...matchConditions.minCalculatedPrice, $gte: Number(minPrice) }
    }
    if (maxPrice) {
        matchConditions.maxCalculatedPrice = { ...matchConditions.maxCalculatedPrice, $lte: Number(maxPrice) }
    }
    let pipeline = [
        {
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
            }
        },
        {
            $unwind: {
                path: '$category',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'subcategories',
                localField: 'subCategory',
                foreignField: '_id',
                as: 'subCategory'
            }
        },
        {
            $unwind: {
                path: '$subCategory',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                minCalculatedPrice: {
                    $multiply: ['$unitPrice', '$weight']
                },
                maxCalculatedPrice: {
                    $multiply: ['$unitPrice', '$weight']
                },
            }
        },
        {
            $project: {
                'category.product': 0,
                'subCategory.product': 0,
            }
        }
    ];

    if (categoryName) {
        pipeline.push({
            $match: {
                'category.categoryName': { $regex: categoryName, $options: 'i' }
            }
        });
    }

    if (subCategoryName) {
        pipeline.push({
            $match: {
                'subCategory.subCategoryName': { $regex: subCategoryName, $options: 'i' }
            }
        });
    }

    if (Object.keys(matchConditions).length > 0) {
        pipeline.push({
            $match: matchConditions
        });
    }

    pipeline.push({
        $facet: {
            totalCount: [
                { $count: 'count' }
            ],
            products: [
                { $sort: { createdAt: -1 } },
                { $skip: (page - 1) * PRODUCTS_PER_PAGE },
                { $limit: PRODUCTS_PER_PAGE }
            ]
        }
    });

    
    const results = await ProductModel.aggregate(pipeline);


    const totalCount = results[0].totalCount.length > 0 ? results[0].totalCount[0].count : 0;
    const products = results[0].products;

    products.forEach(product => {
        if (product.productPhoto) {
            const base64String = product.productPhoto.buffer.toString('base64');
            try {
                product.productPhoto = Buffer.from(base64String, 'base64');
                
            } catch (error) {
                console.error("Error converting productPhoto:", error);
            }
        }
    });
    return res.status(200).send({products:products,count:totalCount});
})


module.exports={createProduct,getAllProducts,getSingleProduct,updateProduct,deleteProduct,updateProductPhoto,getNumberOfProducts,filterProducts};