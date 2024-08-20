import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GainType {
  _id: string;
  gain: number;
  
}
export interface GainPerYearType{
    month:string;
    gain:number
}

export interface GainState {
  gain: GainType | null;
  gainPerYear:GainPerYearType[];
  availableYears:number[];
  isLoading:boolean;
  
}

const initialState: GainState = {
  gain:null,
  gainPerYear:[],
  availableYears:[],
  isLoading:false,
};

const gainSlice = createSlice({
  name: 'gain',
  initialState,
  reducers: {
    getGain: (state, action: PayloadAction<GainType | null>) => {
      state.gain = action.payload;
    },
    getGainPerYear: (state, action: PayloadAction<GainPerYearType[]>) => {
        state.gainPerYear = action.payload;
      },
      getAvailableYearq: (state, action: PayloadAction<number[]>) => {
        state.availableYears = action.payload;
      },
      setIsLoading: (state, action: PayloadAction<boolean>) => {
        state.isLoading = action.payload;
      },
  },
});

const gainActions = gainSlice.actions;
const gainReducer = gainSlice.reducer;

export { gainActions, gainReducer };
