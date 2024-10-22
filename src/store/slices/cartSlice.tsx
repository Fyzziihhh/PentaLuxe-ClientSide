import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// Import your product type definition
import { Cart } from '@/types/cartProductTypes';



interface CartState {
  products: Cart[];
}

const initialState: CartState = {
  products: [],
};

export interface RootState{
  cart:CartState
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
        state.products.push(action.payload);
      },
    setCartProducts:(state, action: PayloadAction<Cart[]>) =>{
      state.products = action.payload;
    },

    changeQuantity(state, action: PayloadAction<{ id: string; action:string; stock: number }>) {
      const product = state.products.find((item) => item._id === action.payload.id);
      if (product) {
        if (action.payload.action === 'INC' && product.quantity < action.payload.stock) {
          product.quantity += 1;
        } else if (action.payload.action === 'DEC' && product.quantity > 1) {
          product.quantity -= 1;
        }
      }
    },

    removeProduct(state, action: PayloadAction<string>) {
      state.products = state.products.filter((product) => product._id !== action.payload);
    },
  },
});

export const { setCartProducts, changeQuantity, removeProduct ,addToCart} = cartSlice.actions;

export default cartSlice.reducer;
