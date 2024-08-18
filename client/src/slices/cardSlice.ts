import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryType, ImageType, SubCategoryType } from "./productSlice";


export interface ProductToBuyType{
    _id:string;
    productName: string;
    description: string;
    carat: number;
    weight: number;
    productPhoto: ImageType;
    stockQuantity: number;
    category: CategoryType;
    subCategory: SubCategoryType;
    
}

export interface CardState {
  isCardOpened:boolean;
  productsList:ProductToBuyType[];
  clientId:string | null;
}

const initialState: CardState = {
    isCardOpened:false,
    productsList:[],
    clientId:null
};

const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    setIsCardToggled:(state,action: PayloadAction<boolean>)=>{
        state.isCardOpened=action.payload;
    },
    addProduct:(state,action:PayloadAction<ProductToBuyType>)=>{
        state.productsList.push(action.payload);
    },
    setClientId:(state,action: PayloadAction<string|null>)=>{
        state.clientId=action.payload;
    },
    removeProduct:(state,action:PayloadAction<string>)=>{
        state.productsList=state.productsList.filter((prod:ProductToBuyType)=> prod._id !=action.payload);
    },
    clearProductsList:(state)=>{
        state.productsList=[];
    }
  },
});

const cardActions = cardSlice.actions;
const cardReducer = cardSlice.reducer;

export { cardActions, cardReducer };
