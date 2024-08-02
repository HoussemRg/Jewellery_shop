import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface CategoryState{
    _id:string,
    categoryName:string,
    categoryDescription:string
    createdAt: Date |null;
    updatedAt: Date | null;
    product:string[]
}


export interface CategorySliceState {
    categories: CategoryState[];
    categoryNumber: number;
    isCategoryCreated:boolean;
    isCategoryUpdated:boolean;
    isCategoryDeleted:boolean;
  }
  
const initialState: CategorySliceState = {
    categories: [],
    categoryNumber: 0,
    isCategoryCreated:false,
    isCategoryUpdated:false,
    isCategoryDeleted:false,

  };
const categorySlice=createSlice({
    name:'category',
    initialState,
    reducers:{
        getAllCategories:(state,action: PayloadAction<CategoryState[]>)=>{
            state.categories=action.payload
        },getCategoryNumber:(state,action)=>{
            state.categoryNumber=action.payload
        },
        setIsCategoryCreated:(state, action: PayloadAction<boolean>)=>{
            state.isCategoryCreated=action.payload;
        },
        updateCategory: (state, action: PayloadAction<CategoryState>) => {
          state.categories = state.categories.map((category) =>
            category._id === action.payload._id ? action.payload : category
          );
        },
        setIsCategoryUpdated:(state,action:PayloadAction<boolean>)=>{
          state.isCategoryUpdated=action.payload;
        },
        setIsCategoryDeleted:(state,action:PayloadAction<boolean>)=>{
          state.isCategoryDeleted=action.payload;
        },
        deleteCategory:(state, action: PayloadAction<string>) => {
            state.categories = state.categories.filter((category) =>
                category._id !== action.payload 
            );
          },
        
    }
})

const categoryActions=categorySlice.actions;
const categoryReducer=categorySlice.reducer;

export {categoryActions,categoryReducer}