import { createSlice } from "@reduxjs/toolkit";


export interface SubCategoryState{
    _id:string,
    subCategoryName:string,
    subCategoryDescription:string
}
const subCategorySlice=createSlice({
    name:'subcategory',
    initialState:{
        subCategories:[],
        subCategoryNumber:0
    },
    reducers:{
        getAllSubCategories:(state,action)=>{
            state.subCategories=action.payload
        },getSubCategoryNumber:(state,action)=>{
            state.subCategoryNumber=action.payload
        }
    }
})

const subCategoryActions=subCategorySlice.actions;
const subCategoryReducer=subCategorySlice.reducer;

export {subCategoryActions,subCategoryReducer}