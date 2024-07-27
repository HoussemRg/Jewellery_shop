import { createSlice } from "@reduxjs/toolkit";


export interface CategoryState{
    _id:string,
    categoryName:string,
    categoryDescription:string
}
const categorySlice=createSlice({
    name:'category',
    initialState:{
        categories:[],
        categoryNumber:0
    },
    reducers:{
        getAllCategories:(state,action)=>{
            state.categories=action.payload
        },getCategoryNumber:(state,action)=>{
            state.categoryNumber=action.payload
        }
    }
})

const categoryActions=categorySlice.actions;
const categoryReducer=categorySlice.reducer;

export {categoryActions,categoryReducer}