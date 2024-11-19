import { configureStore } from '@reduxjs/toolkit';
import cartReducer from  '../store/slices/cartSlice'; // Adjust the path as needed
import userReducer from '../store/slices/userSlice'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { setSearchedProducts } from './slices/searchSlice';




const persistConfig = {
  key: "root",
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    cart: cartReducer,
    user:persistedUserReducer,
    search:setSearchedProducts
   
  },
});
export const persistor = persistStore(store);

export default store;