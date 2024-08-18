import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InvestorType {
  _id: string;
  firstName: string;
  lastName: string;
  cin: string;
  email: string;
  address: string;
  phoneNumber: string;
  createdAt: Date |null;
  updatedAt: Date | null;
}
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
export interface SingleInvestorType{
  _id: string;
  firstName: string;
  lastName: string;
  cin: string;
  email: string;
  address: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  investment:InvestmentType[]
}
export interface InvestorState {
  investors: InvestorType[];
  investorsNumber:number;
  isInvestorCreated:boolean;
  isInvestorUpdated:boolean;
  isInvestorDeleted:boolean;
  isLoading:boolean;
  singleInvestor:SingleInvestorType |null
}

const initialState: InvestorState = {
  investors: [],
  investorsNumber:0,
  isInvestorCreated:false,
  isInvestorUpdated:false,
  isInvestorDeleted:false,
  isLoading:false,
  singleInvestor:null
};

const investorSlice = createSlice({
  name: 'investor',
  initialState,
  reducers: {
    getAllInvestors: (state, action: PayloadAction<InvestorType[]>) => {
      state.investors = action.payload;
    },
    getInvestorsNumber: (state, action: PayloadAction<number>) => {
      state.investorsNumber = action.payload;
    },
    setIsInvestorCreated:(state, action: PayloadAction<boolean>)=>{
        state.isInvestorCreated=action.payload;
    },
    updateInvestor: (state, action: PayloadAction<InvestorType>) => {
      state.investors = state.investors.map((investor) =>
        investor._id === action.payload._id ? action.payload : investor
      );
    },
    setIsInvestorUpdated:(state,action:PayloadAction<boolean>)=>{
      state.isInvestorUpdated=action.payload;
    },
    setIsInvestorDeleted:(state,action:PayloadAction<boolean>)=>{
      state.isInvestorDeleted=action.payload;
    },
    deleteInvestor:(state, action: PayloadAction<string>) => {
        state.investors = state.investors.filter((investor) =>
            investor._id !== action.payload 
        );
      },
    getSingleInvestor:(state,action:PayloadAction<SingleInvestorType>)=>{
      state.singleInvestor=action.payload;
    },
    setIsLoading:(state,action:PayloadAction<boolean>)=>{
      state.isLoading=action.payload;
    },
  },
});

const investorActions = investorSlice.actions;
const investorReducer = investorSlice.reducer;

export { investorActions, investorReducer };
