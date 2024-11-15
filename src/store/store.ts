import { configureStore } from '@reduxjs/toolkit';
import cartReducer from  '../store/slices/cartSlice'; // Adjust the path as needed
import userReducer from '../store/slices/userSlice'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';




const persistConfig = {
  key: "root",
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    cart: cartReducer,
    user:persistedUserReducer
   
  },
});
export const persistor = persistStore(store);

export default store;