import { Heart, MoveRight, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
import { Link, useNavigate } from "react-router-dom";
import { Cart } from "@/types/cartProductTypes";
import { ICoupon } from "../Admin/AdminCouponManagementPage";

const CartPage = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [availableCoupons, setAvailableCoupons] = useState<ICoupon[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();
  const products = useSelector((state: any) => state.cart.products) || [];
  const [discountRate, setDiscountRate] = useState(0);
  const [OriginalPrice, setOriginalPrice] = useState(0);
  const [selectedRate, setSelectedRate] = useState(0);
  const [toggleButton, setToggleButton] = useState(false);
  const selectTagRef = useRef<HTMLSelectElement>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState("");
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

  const OnProceedToCheckOut = async () => {
    try {
      const res = await api.patch("/api/user/cart-total", { totalPrice });
      if (res.status === AppHttpStatusCodes.OK) {
        navigate("/checkout", {
          state: { totalPrice, discountAmount, selectedCoupon },
        });
      }
    } catch (err) {}
  };

  const getCartProducts = async () => {
    try {
      const res = await api.get("/api/user/cart");

      if (res.status === AppHttpStatusCodes.OK) {
        if (res.data.data) {
          dispatch(setCartProducts(res.data.data));
        } else {
          dispatch(setCartProducts([]));
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === AppHttpStatusCodes.UNAUTHORIZED) {
          navigate("/login");
        }
        toast.error(error.response?.data.message);
      }
    }
  };
  const getAllCoupons = async () => {
    try {
      const res = await api.get("/api/user/coupons");
      if (res.status === AppHttpStatusCodes.OK) {
        const { data: coupons } = res.data;
        const filteredCoupons=coupons.filter((coupon:any)=>coupon.expiryDate!==null)
        setCoupons(filteredCoupons);
      }
    } catch (error) {

    }
  };

  const toggleCouponDiscount = () => {
    if (!selectedRate && !toggleButton) {
      toast.info("Select a Coupon");
      selectTagRef.current?.focus();
      return;
    }
    if (!toggleButton) {
      setDiscountRate(selectedRate);
      setToggleButton(true);
    } else {
      setDiscountRate(0);
      setSelectedRate(0);
      setToggleButton(false);
    }
  };

  const handleOnCouponChange = (couponRate: number, couponName: string) => {
    setSelectedRate(couponRate);
    setSelectedCoupon(couponName);
  };

  useEffect(() => {
    getAllCoupons();
    getCartProducts();
  }, []);

  useEffect(() => {
    const calculatedTotal = products.reduce((acc: number, product: Cart) => {
      const discountedPrice =
        product.product?.DiscountPercentage > 0
          ? product.variant.price *
            (1 - product.product?.DiscountPercentage / 100)
          : product.variant.price;

      return acc + discountedPrice * product.quantity;
    }, 0);
    const deliveryCharge = 40;

    let finalPrice = deliveryCharge + calculatedTotal;
    if (discountRate > 0) {
      const selectedCoupon = availableCoupons.find(
        (coupon) => coupon.discountPercentage === selectedRate
      );
      if (selectedCoupon) {
        const calculatedDiscount = (calculatedTotal * discountRate) / 100;
        const maxDiscountPrice = selectedCoupon.maxDiscountPrice;

        const finalDiscount = Math.min(
          calculatedDiscount,
          Number(maxDiscountPrice)
        );
          
        setDiscountAmount(finalDiscount);
        finalPrice -= finalDiscount;
      }
    }

    setOriginalPrice(calculatedTotal);
    setTotalPrice(finalPrice);
  }, [products, discountRate]);


  useEffect(() => {
    const filteredCoupons = coupons.filter(
      (coupon) => OriginalPrice >= Number(coupon.minimumPurchasePrice)
    );

    setAvailableCoupons(filteredCoupons);
  
  }, [OriginalPrice, coupons]);
  useEffect(()=>{
   if(availableCoupons.length===0){
    setSelectedCoupon('')
  setDiscountRate(0)
    setSelectedRate(0)
    setDiscountAmount(0)
    setToggleButton(false)
   }
  },[availableCoupons])

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
              {products.map((product: Cart) => (
                <div
                  key={product._id}
                  className="product   p-7 mt-5 flex gap-4 border-t-2 border-2 border-gray-500 rounded-xl "
                >
                  <div className="image bg-slate-50 w-32 h-28 ">
                    <img
                      className="w-full h-full object-over"
                      src={product?.product?.Images?.[0]}
                      alt={product?.product?.Name || "Product Image"}
                    />
                  </div>

                  <div className="details  w-[80%] flex justify-between items-center">
                    <div className="product-name-price-stock flex flex-col gap-2">
                      <h1 className="font-mono">{product.product?.Name}</h1>
                      <h1 className="text-sm">{product?.variant.volume}</h1>
                      <h1 className="flex items-center gap-3">
                        {/* Display the original price */}
                        <p className="line-through text-gray-400">
                          ₹{product.variant.price}
                        </p>{" "}
                        {/* Original Price */}
                        {product.product?.DiscountPercentage && (
                          <p>
                            ₹
                            {(
                              product.variant.price *
                              (1 - product.product.DiscountPercentage / 100)
                            ).toFixed(2)}
                          </p>
                        )}
                        <div className="w-[2px] h-4 bg-slate-500"></div>
                        <p className="text-green-700">
                          {product.variant.stock > 10 ? (
                            <span>In Stock</span>
                          ) : product.variant.stock === 0 ? (
                            <span>Out of Stock</span>
                          ) : (
                            <span className="text-red-700 font-bold">{`Only ${product.variant.stock} are left !!`}</span>
                          )}
                        </p>
                      </h1>
                      <div className="buttons flex items-center mt-3 gap-3 ml-3 text-zinc-500">
                        <button
                          onClick={() => handleProductRemove(product._id)}
                        >
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
                              product.variant.stock
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
                              product.variant.stock
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
                        ₹
                        {(
                          product.variant.price *
                          (1 - product.product?.DiscountPercentage / 100) *
                          product.quantity
                        ).toFixed(0)}
                      </h1>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-summary-coupon w-[30%] flex flex-col gap-5">
              <div className="coupon-container w-full border  mt-5 p-2">
                <div className="flex gap-3  h-12  w-full">
                  <div className="flex gap-3 h-full w-[65%] text-black">
                    <select
                      ref={selectTagRef}
                      value={selectedRate}
                      onChange={(e) =>
                        handleOnCouponChange(
                          Number(e.target.value),
                          e.target.options[e.target.selectedIndex].text
                        )
                      }
                      className="w-full px-4 font-bold h-full rounded focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={
                        availableCoupons.length === 0 || discountRate > 0
                      } // Disable if no coupons are available
                    >
                      <option>
                        {availableCoupons.length === 0
                          ? "No Coupons Available"
                          : "Select a Coupon"}
                      </option>
                      {availableCoupons.map((coupon) => (
                        <option
                          key={coupon._id}
                          value={coupon.discountPercentage}
                        >
                          {coupon.couponName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={toggleCouponDiscount}
                    className={`${
                      toggleButton ? "bg-red-800" : "bg-green-800"
                    } rounded h-full px-4 `}
                  >
                    {toggleButton ? "Remove Coupon" : "Apply Coupon"}
                  </button>
                </div>
              </div>
              <div className="order-summary px-8 py-5 w-full  border rounded-xl mt-5">
                <h1 className="font-bold text-xl font-montserrat">
                  Order Summary
                </h1>
                <h1 className="mt-5 flex justify-between">
                  <span className="font-bold font-mono">Original Price</span>
                  <span className="font-bold font-mono">
                    {OriginalPrice.toFixed(0)}
                  </span>
                </h1>
                <h1 className="mt-5 flex justify-between">
                  <span className="font-bold font-mono">Delivery</span>
                  <span className="font-bold font-mono">₹40</span>
                </h1>

                {discountRate !== 0 &&availableCoupons.length>0 ?(
                  <h1 className="mt-5 flex justify-between">
                    <span className="font-bold font-mono">Coupon</span>
                    <span className="font-extrabold font-mono text-green-800">
                      - {discountAmount.toFixed(2)}
                    </span>
                  </h1>
                ):<></>}
                <div className="w-full bg-gray-500 mt-5 h-[1px]"></div>
                <h1 className="mt-5 flex justify-between text-xl">
                  <span className="font-bold font-mono ">Total</span>
                  <span className="font-bold font-mono">
                    ₹{totalPrice.toFixed(0)}
                  </span>
                </h1>

                <button
                  onClick={OnProceedToCheckOut}
                  className="bg-green-900  rounded-xl py-3 mt-5 w-full font-bold text-lg font-montserrat hover:bg-green-950"
                >
                  Proceed to Checkout
                </button>

                <p className="flex mt-5 justify-center gap-3 font-montserrat font-bold">
                  Or{" "}
                  <Link
                    to="/products"
                    className="flex text-green-700  underline gap-2 "
                  >
                    Continue Shopping <MoveRight />{" "}
                  </Link>{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
