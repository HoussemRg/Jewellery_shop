import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InvestorType } from "./investorSlice";
import { ProductType } from "./productSlice";


export interface InvestmentType{
    _id:string,
    investmentName:string,
    investor:InvestorType,
    product:string[],
    startDate:Date |null;
    endDate:Date |null;
    investmentState:string;
    investmentAmount:number;
    investedAmount:number;
    gain:number
}
export interface SingleInvestmentType{
    _id:string,
    investmentName:string,
    investor:InvestorType,
    product:ProductType[],
    startDate:Date |null;
    endDate:Date |null;
    investmentState:string;
    investmentAmount:number;
    investedAmount:number;
    gain:number;
    createdAt:Date |null;
    updatedAt:Date |null;
}
export interface InvestmentState {
  investments: InvestmentType[];
  isInvestmentCreated:boolean;
  isInvestmentUpdated:boolean;
  isInvestmentDeleted:boolean;
  isLoading:boolean;
  singleInvestment:SingleInvestmentType |null
}

const initialState: InvestmentState = {
  investments: [],
  isInvestmentCreated:false,
  isInvestmentUpdated:false,
  isInvestmentDeleted:false,
  isLoading:false,
  singleInvestment:null
};

const investmentSlice = createSlice({
  name: 'investment',
  initialState,
  reducers: {
    getAllInvestments: (state, action: PayloadAction<InvestmentType[]>) => {
      state.investments = action.payload;
    },
    
    setIsInvestmentCreated:(state, action: PayloadAction<boolean>)=>{
        state.isInvestmentCreated=action.payload;
    },
    updateInvestment: (state, action: PayloadAction<InvestmentType>) => {
      state.investments = state.investments.map((investment) =>
        investment._id === action.payload._id ? action.payload : investment
      );
    },
    setIsInvestmentUpdated:(state,action:PayloadAction<boolean>)=>{
      state.isInvestmentUpdated=action.payload;
    },
    setIsInvestmentDeleted:(state,action:PayloadAction<boolean>)=>{
      state.isInvestmentDeleted=action.payload;
    },
    deleteInvestment:(state, action: PayloadAction<string>) => {
        state.investments = state.investments.filter((investment) =>
            investment._id !== action.payload 
        );
      },
    getSingleInvestment:(state,action:PayloadAction<SingleInvestmentType>)=>{
      state.singleInvestment=action.payload;
    },
    setIsLoading:(state,action:PayloadAction<boolean>)=>{
      state.isLoading=action.payload;
    },
  },
});

const investmentActions = investmentSlice.actions;
const investmentReducer = investmentSlice.reducer;

export { investmentActions, investmentReducer };
