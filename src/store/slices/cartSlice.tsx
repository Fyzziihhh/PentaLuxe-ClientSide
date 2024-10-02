import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProduct } from '@/types/productTypes'; // Import your product type definition

interface CartProduct {
  stock: number;
  price: number;
  quantity: number;
  volume: string;
  product: IProduct;
  _id: string;
}

interface CartState {
  products: CartProduct[];
}

const initialState: CartState = {
  products: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
        state.products.push(action.payload);
      },
    setCartProducts:(state, action: PayloadAction<CartProduct[]>) =>{
      state.products = action.payload;
    },

    changeQuantity(state, action: PayloadAction<{ id: string; action:string; stock: number }>) {
      const product = state.products.find((item) => item._id === action.payload.id);
      if (product) {
        if (action.payload.action === 'INC' && product.quantity < product.stock) {
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
