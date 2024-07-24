import { createSlice } from "@reduxjs/toolkit";

export interface ImageType{
    type:string,
    data:Uint8Array
}

export interface ProductState{
    _id: string,
    productName:string,
    description:string,
    carat:number,
    weight:number,
    productPhoto:ImageType,
    //store:string,
    purchasePrice:number,
    unitPrice:number,
    stockQuantity:number,
    category:string,
    subCategory:string,
    //__v:number
}


const initialState={
    products: []
}


const productSlice=createSlice({
    name:'product',
    initialState,
    reducers:{
        getProducts:(state,action)=>{
            state.products=action.payload;
        }
    }
});

const productActions=productSlice.actions;
const productReducers=productSlice.reducer;
export {productActions,productReducers}