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
  
}

const initialState: GainState = {
  gain:null,
  gainPerYear:[]
};

const gainSlice = createSlice({
  name: 'gain',
  initialState,
  reducers: {
    getGain: (state, action: PayloadAction<GainType>) => {
      state.gain = action.payload;
    },
    getGainPerYear: (state, action: PayloadAction<GainPerYearType[]>) => {
        state.gainPerYear = action.payload;
      },
  },
});

const gainActions = gainSlice.actions;
const gainReducer = gainSlice.reducer;

export { gainActions, gainReducer };
