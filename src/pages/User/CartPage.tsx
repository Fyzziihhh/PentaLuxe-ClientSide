import { Heart, MoveRight, Trash2 } from "lucide-react";
import { useEffect } from "react";

import api from "@/services/apiService";
import { AppHttpStatusCodes } from "@/types/statusCode";
import { AxiosError } from "axios";
import { toast } from "sonner";
import EmptyCart from "@/components/EmptyCart";

import { useDispatch, useSelector } from "react-redux";
import {
  setCartProducts,
  changeQuantity,
  removeProduct,
} from "@/store/slices/cartSlice";
import { IProduct } from "@/types/productTypes";
interface CartProduct {
  stock: number;
  price: number;
  quantity: number;
  volume: string;
  product: IProduct;
  _id: string;
}
const CartPage = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: any) => state.cart.products);

  const handleChangeQuantity = async (
    itemId: string,
    action: string,
    stock: number
  ) => {
    try {
      const res = await api.patch("/api/user/cart", { itemId, action, stock });
      if (res.status === AppHttpStatusCodes.OK) {
        dispatch(changeQuantity({ id: itemId, action, stock }));
      }
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
    }
  };

  const handleProductRemove = async (id: string) => {
    try {
      const res = await api.delete(`/api/user/cart/${id}`);
      if (res.status === AppHttpStatusCodes.OK) {
        dispatch(removeProduct(id));
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };
  const getCartProducts = async () => {
    try {
      const res = await api.get("/api/user/cart");
      if (res.status === AppHttpStatusCodes.OK) {
        dispatch(setCartProducts(res.data.cart.products));
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };
  useEffect(()=>{
    getCartProducts()
  },[])

  return (
    <div className="w-full ">
      {!products?.length ? (
        <EmptyCart />
      ) : (
        <div className="w-full py-5">
          <h1 className="text-4xl font-montserrat font-bold ml-9 text-center mt-5 mr-24">
            Your Bag
          </h1>
          <div className="cart-container  w-[full] gap-6 h-full flex justify-center ">
            <div className="products  w-[60%]">
              {products.map((product: CartProduct) => (
                <div key={product._id} className="product   p-7 mt-5 flex gap-4 border-t-2 border-2 border-gray-500 rounded-xl ">
                  <div className="image bg-slate-50 w-32 h-28 ">
                    <img
                      className="w-full h-full object-over"
                      src={product?.product?.productImages?.[0]}
                      alt={product?.product?.productName || "Product Image"}
                    />
                  </div>

                  <div className="details  w-[80%] flex justify-between items-center">
                    <div className="product-name-price-stock flex flex-col gap-2">
                      <h1 className="font-mono">
                        {product.product?.productName}
                      </h1>
                      <h1 className="text-sm">{product?.volume}</h1>
                      <h1 className="flex items-center gap-3">
                        <p>${product.price}</p>
                        <div className="w-[2px] h-4 bg-slate-500"></div>
                        <p className="text-green-700">
                          {product.stock >= 10 ? (
                            <span>In Stock</span>
                          ) : product.stock === 0 ? (
                            <span>Out of Stock</span>
                          ) : (
                            <span className="text-red-700 font-bold">{`Only ${product.stock} are left !!`}</span>
                          )}
                        </p>
                      </h1>
                      <div className="buttons flex items-center mt-3 gap-3 ml-3 text-zinc-500">
                        <button
                          onClick={() => handleProductRemove(product._id)}
                        >
                          {" "}
                          <Trash2 />
                        </button>
                        <button>
                          <Heart />
                        </button>
                      </div>
                    </div>
                    <div className="quantity">
                      <p className="flex items-center gap-3">
                        <button
                          disabled={product.quantity === 1}
                          onClick={() =>
                            handleChangeQuantity(
                              product._id,
                              "DEC",
                              product.stock
                            )
                          }
                          className={`bg-slate-600 px-3 rounded-lg font-bold text-xl ${
                            product.quantity === 1
                              ? "opacity-50"
                              : "hover:bg-slate-700"
                          }`}
                        >
                          -
                        </button>
                        <span className="font-bold">{product.quantity}</span>
                        <button
                          onClick={() =>
                            handleChangeQuantity(
                              product._id,
                              "INC",
                              product.stock
                            )
                          }
                          className="bg-slate-600 px-3 rounded-lg font-bold text-xl"
                        >
                          +
                        </button>
                      </p>
                    </div>
                    <div className="total-price">
                      <h1 className="font-bold text-xl font-Quando ">
                        ${product.price * product.quantity}
                      </h1>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary p-8 w-[25%] h-[400px] border rounded-xl mt-5">
              <h1 className="font-bold text-xl font-montserrat">Order Summary</h1>
              <h1 className="mt-5 flex justify-between">
                <span className="font-bold font-mono">Original Price</span>
                <span className="font-bold font-mono">$1000</span>
              </h1>
              <h1 className="mt-5 flex justify-between">
                <span className="font-bold font-mono">Delivery</span>
                <span className="font-bold font-mono">$40</span>
              </h1>

            <div className="w-full bg-gray-500 mt-10 h-[1px]"></div>
            <h1 className="mt-5 flex justify-between text-xl">
                <span className="font-bold font-mono ">Total</span>
                <span className="font-bold font-mono">$1040</span>
              </h1>

              <button className="bg-green-900  rounded-xl py-3 mt-5 w-full font-bold text-lg font-montserrat hover:bg-green-950">Proceed to Checkout</button>

               <p className="flex mt-5 justify-center gap-3 font-montserrat font-bold">Or <span className="flex text-green-700  underline gap-2 ">Continue Shopping <MoveRight /> </span> </p>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
