import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ImageType {
    type: string;
    data: Uint8Array;
}

export interface CategoryType {
    _id: string;
    categoryName: string;
    categoryDescription: string;
}

export interface SubCategoryType {
    _id: string;
    subCategoryName: string;
    subCategoryDescription: string;
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
}

export interface ProductState {
    products: ProductType[];
    currentPage:number
    productsCount: number;
    isProductCreated: boolean;
    isProductUpdated:boolean;
    filteredProducts:ProductType[]
}

const initialState: ProductState = {
    products: [],
    currentPage:1,
    productsCount: 0,
    isProductCreated: false,
    isProductUpdated:false,
    filteredProducts:[]
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        getProducts: (state, action: PayloadAction<ProductType[]>) => {
            state.products = action.payload;
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
        }
        
    }
});

const productActions = productSlice.actions;
const productReducers = productSlice.reducer;
export { productActions, productReducers };