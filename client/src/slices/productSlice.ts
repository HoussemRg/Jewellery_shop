import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CouponType } from "./couponSlice";

export interface ImageType {
    type: string;
    data: Uint8Array;
}

export interface CategoryType {
    _id: string;
    categoryName: string;
    categoryDescription: string;
    coupon:CouponType[]
}

export interface TopProductsType{
    _id:string;
    totalQuantitySold:number;
    productName:string;
}

export interface SubCategoryType {
    _id: string;
    subCategoryName: string;
    subCategoryDescription: string;
    coupon:CouponType[]
}

export interface ProductType { 
    _id: string;
    productName: string;
    description: string;
    carat: number;
    weight: number;
    productPhoto: ImageType;
    purchasePrice: number;
    unitPrice: number;
    stockQuantity: number;
    category: CategoryType;
    subCategory: SubCategoryType;
    coupon:CouponType[];
    purchaseSource:string
}

export interface ProductState {
    products: ProductType[];
    topProducts:TopProductsType[];
    productsList:ProductType[];
    currentPage:number
    productsCount: number;
    isProductCreated: boolean;
    isProductUpdated:boolean;
    isLoading:boolean;
    isLoadingFullDahsboard:boolean;
    filteredProducts:ProductType[];
    filteredProductsCount:number;
    isProductsFiltered:boolean
}

const initialState: ProductState = {
    products: [],
    topProducts:[],
    productsList:[],
    currentPage:1,
    productsCount: 0,
    isProductCreated: false,
    isProductUpdated:false,
    isLoading:false,
    isLoadingFullDahsboard:false,
    filteredProducts:[],
    filteredProductsCount:0,
    isProductsFiltered:false
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        getProducts: (state, action: PayloadAction<ProductType[]>) => {
            state.products = action.payload;
        },
        getAllProducts: (state, action: PayloadAction<ProductType[]>) => {
            state.productsList = action.payload;
        },
        getTopProducts:(state, action: PayloadAction<TopProductsType[]>) => {
            state.topProducts = action.payload;
        },
        setCurrentPage:(state,action: PayloadAction<number>)=>{
            state.currentPage=action.payload
        },
        getProductsNumber: (state, action: PayloadAction<number>) => {
            state.productsCount = action.payload;
        },
        setIsProductCreated: (state, action: PayloadAction<boolean>) => {
            state.isProductCreated = action.payload;
        },
        deleteProduct: (state, action: PayloadAction<string>) => {
            state.products = state.products.filter(p => p._id !== action.payload);
        },
        updateProduct:(state,action:PayloadAction<ProductType>)=>{
            state.products=state.products.map(p => {
                if(p._id === action.payload._id){
                    return action.payload;
                }
                return p;
            })
        },
        setIsProductUpdated:(state, action: PayloadAction<boolean>)=>{
            state.isProductUpdated = action.payload;
        },
        getProductFiltered:(state,action: PayloadAction<ProductType[]>)=>{
            state.filteredProducts=action.payload
        },
        getFilteredProductsCount:(state,action: PayloadAction<number>)=>{
            state.filteredProductsCount=action.payload;
        },
        setIsProductsFiltered:(state,action: PayloadAction<boolean>)=>{
            state.isProductsFiltered=action.payload
        },
        resetFiltredProducts:(state)=>{
            state.filteredProducts=[]
        },
        resetFiltredProductsCount:(state)=>{
            state.filteredProductsCount=0
        },
        setIsLoading:(state,action:PayloadAction<boolean>)=>{
            state.isLoading=action.payload;
          },
          setIsLoadingFullDashboard:(state,action:PayloadAction<boolean>)=>{
            state.isLoading=action.payload;
          },
    }
});

const productActions = productSlice.actions;
const productReducers = productSlice.reducer;
export { productActions, productReducers };