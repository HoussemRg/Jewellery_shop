import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface SubCategoryState{
    _id:string,
    subCategoryName:string,
    subCategoryDescription:string,
    product:string[]
}

export interface SubCategorySliceState {
    subCategories: SubCategoryState[];
    subCategoryNumber: number; 
    isSubCategoryCreated:boolean,
    isSubCategoryUpdated:boolean,
    isSubCategoryDeleted:boolean,
  }
  
const initialState: SubCategorySliceState = {
    subCategories: [],
    subCategoryNumber: 0,
    isSubCategoryCreated:false,
    isSubCategoryUpdated:false,
    isSubCategoryDeleted:false,
  };
const subCategorySlice=createSlice({
    name:'subcategory',
    initialState,
    reducers:{
        getAllSubCategories:(state,action: PayloadAction<SubCategoryState[]>)=>{
            state.subCategories=action.payload
        },getSubCategoryNumber:(state,action: PayloadAction<number>)=>{
            state.subCategoryNumber=action.payload
        },
        setIsSubCategoryCreated:(state, action: PayloadAction<boolean>)=>{
            state.isSubCategoryCreated=action.payload;
        },
        updateSubCategory: (state, action: PayloadAction<SubCategoryState>) => {
          state.subCategories = state.subCategories.map((subCategory) =>
            subCategory._id === action.payload._id ? action.payload : subCategory
          );
        },
        setIsSubCategoryUpdated:(state,action:PayloadAction<boolean>)=>{
          state.isSubCategoryUpdated=action.payload;
        },
        setIsSubCategoryDeleted:(state,action:PayloadAction<boolean>)=>{
          state.isSubCategoryDeleted=action.payload;
        },
        deleteSubCategory:(state, action: PayloadAction<string>) => {
            state.subCategories = state.subCategories.filter((subCategory) =>
                subCategory._id !== action.payload 
            );
          },
        
    }
})

const subCategoryActions=subCategorySlice.actions;
const subCategoryReducer=subCategorySlice.reducer;

export {subCategoryActions,subCategoryReducer}