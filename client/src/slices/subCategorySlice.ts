import { createSlice } from "@reduxjs/toolkit";


export interface SubCategoryState{
    _id:string,
    subCategoryName:string,
    subCategoryDescription:string
}

export interface SubCategorySliceState {
    subCategories: SubCategoryState[];
    subCategoryNumber: number; 
  }
  
const initialState: SubCategorySliceState = {
    subCategories: [],
    subCategoryNumber: 0,
  };
const subCategorySlice=createSlice({
    name:'subcategory',
    initialState,
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