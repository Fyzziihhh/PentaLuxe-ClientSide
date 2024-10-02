import { configureStore } from '@reduxjs/toolkit';
import cartReducer from  '../store/slices/cartSlice'; // Adjust the path as needed

const store = configureStore({
  reducer: {
    cart: cartReducer,
   
  },
});

export default store;