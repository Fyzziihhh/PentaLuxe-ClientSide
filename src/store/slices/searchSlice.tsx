import { IProduct } from "@/types/productTypes";
import { createSlice } from "@reduxjs/toolkit";
interface InitialState{
    searchedProducts:IProduct[]
}
const initialState:InitialState = {
    searchedProducts:[], 
  }

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchedProducts: (state, action) => {
      state.searchedProducts = action.payload; 
    },
    clearSearchedProducts: (state) => {
      state.searchedProducts = [];
    },
  },
});

export const { setSearchedProducts, clearSearchedProducts } =
  searchSlice.actions;

export default searchSlice.reducer;
