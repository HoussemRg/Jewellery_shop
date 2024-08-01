import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {  UserType } from "./userSlice";

export interface StoreOriginalType {
  _id: string;
  storeName: string;
  description: string;
  address:string
  createdAt: Date |null;
  updatedAt: Date | null;
}


export interface SingleStoreType{
    _id: string;
    storeName: string;
    description: string;
    address:string
    createdAt: Date |null;
    updatedAt: Date | null;
    user:UserType[]
}

export interface StoreState {
  stores: StoreOriginalType[];
  isStoreCreated:boolean;
  isStoreUpdated:boolean;
  isStoreDeleted:boolean;
  singleStore:SingleStoreType |null
}

const initialState: StoreState = {
  stores: [],
  isStoreCreated:false,
  isStoreUpdated:false,
  isStoreDeleted:false,
  singleStore:null
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    getAllStores: (state, action: PayloadAction<StoreOriginalType[]>) => {
      state.stores = action.payload;
    },
    setIsStoreCreated:(state, action: PayloadAction<boolean>)=>{
        state.isStoreCreated=action.payload;
    },
    updateStore: (state, action: PayloadAction<StoreOriginalType>) => {
      state.stores = state.stores.map((store) =>
        store._id === action.payload._id ? action.payload : store
      );
    },
    setIsStoreUpdated:(state,action:PayloadAction<boolean>)=>{
      state.isStoreUpdated=action.payload;
    },
    setIsStoreDeleted:(state,action:PayloadAction<boolean>)=>{
      state.isStoreDeleted=action.payload;
    },
    deleteStore:(state, action: PayloadAction<string>) => {
        state.stores = state.stores.filter((store) =>
            store._id !== action.payload 
        );
      },
    getSingleStore:(state,action:PayloadAction<SingleStoreType>)=>{
      state.singleStore=action.payload;
    }
  },
});

const storeActions = storeSlice.actions;
const storeReducer = storeSlice.reducer;

export { storeActions, storeReducer };
