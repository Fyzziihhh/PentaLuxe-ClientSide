import { IAddress } from "@/types/AddressTypes";
import Input from "@/components/Input/Input";
import {  setCartProducts } from "@/store/slices/cartSlice";
// import { Cart } from "@/types/cartProductTypes";
import Modal from "react-modal";
import { Plus } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AppHttpStatusCodes } from "@/types/statusCode";
import api from "@/services/apiService";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Cart } from "@/types/cartProductTypes";
import { addressValidation } from "@/utils/AddressValidation";

interface IOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  productImage: string;
}

interface IOrderDetails {
  addressId: string;
  items: IOrderItem[];
  paymentMethod: string;
  totalAmount: number;
}

// src/global.d.ts or src/razorpay.d.ts
declare global {
  interface Window {
    Razorpay: {
      new (options: any): {
        open: () => void;
        close: () => void;
        // Add more methods if needed
        on: (
          event: "payment.failed",
          callback: (response: any) => void
        ) => void;
      };
    };
  }
}

interface InputField {
  label: FormKeys;
  type: string;
}
const inputsArray: InputField[] = [
  { label: "Name", type: "text" },
  { label: "Phone", type: "number" },
  { label: "Pincode", type: "number" },
  { label: "Locality", type: "text" },
  { label: "FlatNumberOrBuildingName", type: "text" },
  { label: "Landmark", type: "text" },
  { label: "State", type: "text" },
  { label: "District", type: "text" },
];

type FormKeys =
  | "Name"
  | "Phone"
  | "Pincode"
  | "Locality"
  | "FlatNumberOrBuildingName"
  | "Landmark"
  | "District"
  | "State";

const CheckOutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [addressBtnToggle, setAddressBtnToggle] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [addressId, setAddressId] = useState("");

  const [addressType, setAddressType] = useState("");
  const [addresses, setAddresses] = useState<IAddress[] | []>([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  // const products = useSelector((state: RootState) => state.cart.products);
  const totalPrice = location.state?.totalPrice || 0;
  const couponDiscount = location.state?.discountAmount;
  const couponCode = location.state?.selectedCoupon;
  const [products, setProducts] = useState<Cart[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formState, setFormState] = useState<any>({
    Name: "",
    Phone: "",
    Pincode: "",
    Locality: "",
    FlatNumberOrBuildingName: "",
    Landmark: "",
    District: "",
    State: "",
  });

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAddress(event.target.value);
  };

  const onInputHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setFormState((prevState:any) => ({
      ...prevState,
      [name as FormKeys]: value,
    }));
  };

  const onAddressHandler = async (e: FormEvent, action: string = "Add") => {
    const validationError = addressValidation(formState);
  if (validationError) {
    toast.error(validationError); // Show error message
    return;
  }
    setAddressBtnToggle(true);
    e.preventDefault();
    try {
      let res;

      if (action === "Add") {
        res = await api.post("/api/user/address-book", {
          formState,
          addressType,
        });
      } else {
        res = await api.put("/api/user/address-book", {
          formState,
          addressType,
          addressId,
        });
      }

      if (res.status === AppHttpStatusCodes.CREATED || AppHttpStatusCodes.OK) {
        console.log("res", res.data);
        const Address: IAddress = res.data.data;
        console.log("Address", Address);
        setIsModalOpen(false);
        if (res.status === AppHttpStatusCodes.CREATED) {
          // Add new address to the state
          setAddresses((prev) => [...prev, Address]);
        } else {
          // Update existing address
          setAddresses((prev) =>
            prev.map((address) =>
              address._id === Address._id ? { ...address, ...Address } : address
            )
          );
        }
        setFormState({
          Name: "",
          Phone: "",
          Pincode: "",
          Locality: "",
          FlatNumberOrBuildingName: "",
          Landmark: "",
          District: "",
          State: "",
        });
      } else {
        setIsModalOpen(false);
      }
    } catch (err) {
      // Handle errors
      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data.message || "Error adding/updating address:"
        );
      } else {
        toast.error("Error adding/updating address:");
      }
    }
  };

  const getUserAddresses = async () => {
    const res = await api.get("/api/user/address-book");
    if (res.status === AppHttpStatusCodes.OK) {
      setAddresses(res.data.data);
    }
  };

  const handleWalletPaymentAndPlaceOrder = async (orderDetails: any) => {
    const res = await api.post("/api/user/wallet-payment", {
      orderDetails,
      totalPrice,
    });
    if (res.status === AppHttpStatusCodes.CREATED) {
      handleOrderSuccess(res.data.data);
    }
  };

  const handleEditAddress = (id: string) => {
    setIsEditMode(true);

    // Example logic to fetch address details based on id
    const addressToEdit = addresses.find((address) => address._id === id);

    setAddressId(id);

    if (addressToEdit) {
      console.log(addressToEdit)
      setFormState(addressToEdit);
      setAddressType(addressToEdit.addressType);
      setIsModalOpen(true);
    } else {
      toast.error("Address not found!");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address before proceeding.");
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method to continue.");
      return;
    }

    // if (isProcessing) return;
    // setIsProcessing(true);

    const items = products.map((product) => ({
      productId: product.product._id,
      productName: product.product.Name,
      quantity: product.quantity,
      price:
        product.variant.price -
        (product.variant.price * product.product.DiscountPercentage) / 100,
      subtotal:
        (product.variant.price -
          (product.variant.price * product.product.DiscountPercentage) / 100) *
        product.quantity,
      productImage: product.product.Images[0],
      discountPercentage: product.product.DiscountPercentage,
      categoryName: product.product.CategoryId.categoryName || "helo",
    }));

    const orderDetails = {
      addressId: selectedAddress,
      items,
      paymentMethod: selectedPaymentMethod,
      totalAmount: totalPrice,
      couponDiscount,
      couponCode,
    };

    try {
      if (selectedPaymentMethod === "Razorpay") {
        await handleRazorpayPayment(orderDetails);
      } else if (selectedPaymentMethod === "Wallet") {
        await handleWalletPaymentAndPlaceOrder(orderDetails);
      } else {
        await processOrderSubmission(orderDetails);
      }
    } catch (error) {
      // handleError(error);
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
    } finally {
      // setIsProcessing(false);
    }
  };

  const handleRazorpayPayment = async (orderDetails: IOrderDetails) => {
    const {
      data: { data: key },
    } = await api.get("/api/user/getkey");
    const {
      data: { data: order },
    } = await api.post("/api/user/create-razorpay-order", { totalPrice });

    const options = {
      key,
      amount: order.amount,
      currency: "INR",
      name: "PentaLuxe Ecommerce",
      description: "Order Payment",
      order_id: order.id,
      handler: async function (response: any) {
        await verifyPaymentAndCreateOrder(response, orderDetails);
      },
      prefill: {
        name: "PentaLuxe Customer",
        email: "customer@example.com",
        contact: "9000090000",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on("payment.failed", async function (response) {
      console.log("payment failed response", response);
          await api.post("/api/user/razorpay-payment-failure", {
        response,
        orderDetails,
      });
      console.log('inside the failure of razorpay')

      // Notify user of payment failure
    });
    razorpay.open();

    const verifyPaymentAndCreateOrder = async (
      paymentResponse: any,
      orderDetails: IOrderDetails
    ) => {
      try {
        const response = await api.post(
          "/api/user/verify-payment-and-create-order",
          {
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_signature: paymentResponse.razorpay_signature,
            orderDetails,
          }
        );

        if (response.status === AppHttpStatusCodes.CREATED) {
          handleOrderSuccess(response.data.data);
        }
      } catch (error) {
        if (error instanceof AxiosError)
          toast.error(
            error.response?.data.message || "Payment verification failed."
          );
        // handleError(error);
      }
    };
  };

  const processOrderSubmission = async (orderDetails: IOrderDetails) => {
    try {
      const response = await api.post("/api/user/place-order", orderDetails);

      if (response.status === AppHttpStatusCodes.CREATED) {
        console.log("order success", response);
        handleOrderSuccess(response.data.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };

  const handleOrderSuccess = (data: {
    orderId: string;
    estimatedDeliveryDate: string;
  }) => {
    dispatch(setCartProducts([]));
    navigate("/order/success", {
      state: {
        orderId: data.orderId,
        DeliveryDate: data.estimatedDeliveryDate,
      },
    });
  };

  const getUserCartProducts = async () => {
    const res = await api.get("/api/user/cart");
    if (res.status === AppHttpStatusCodes.OK) {
      console.log(res.data);
      setProducts(res.data.data);
    }
  };
  const baseHeight = 350; // base height in pixels
  const extraHeightPerProduct = 100; // extra height for each product
  const dynamicHeight =
    baseHeight + Math.max(0, products.length - 1) * extraHeightPerProduct;

  useEffect(() => {
    getUserAddresses();
    getUserCartProducts();
  }, []);

  return (
    <div className="w-full   px-32 pb-5">
      <h1 className="font-Quando  text-4xl  underline underline-offset-8">
        Checkout
      </h1>
      <div className="container flex gap-9">
        {/* Address Section */}
        <div className="w-[60%] address-session">
          <h1 className="mt-5 font-bold text-2xl text-white">
            Select a Delivery Address
          </h1>
          <div className="w-full bg-secondary rounded-lg shadow-md px-5 py-4 mt-3">
            <h1 className="font-bold text-xl text-gray-100">Your Addresses</h1>
            <div className="w-full h-[1px] bg-gray-500 my-2"></div>
            <div className="addresses mt-2 flex flex-col gap-3">
              {addresses.map((address: IAddress) => (
                <div
                  key={address?._id}
                  className="address flex items-start gap-2 border border-gray-600 p-4 rounded-lg bg-gray-800 hover:bg-blue-950 cursor-pointer transition duration-300 ease-in-out"
                  onClick={() => setSelectedAddress(address?._id)}
                >
                  <input
                    className="mt-1"
                    type="radio"
                    name="address"
                    id={`address-${address?._id}`}
                    value={address?._id}
                    checked={selectedAddress === address?._id}
                    onChange={handleAddressChange}
                  />
                  <div className="flex-1">
                    <p className="text-gray-200">
                      <strong>{address?.Name}</strong>,{" "}
                      {address?.FlatNumberOrBuildingName}, {address?.Landmark},{" "}
                      {address?.Locality}, {address?.District}, {address?.State}
                      , {address?.Pincode}
                    </p>
                    <span
                      className="text-blue-400 underline cursor-pointer"
                      onClick={() => handleEditAddress(address?._id)}
                    >
                      Edit
                    </span>
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  setIsEditMode(false);
                  setIsModalOpen(true);
                  setAddressBtnToggle(false);
                }}
                className="flex items-center justify-center bg-yellow-600 p-3 rounded-md mt-6 text-lg font-bold text-gray-800 hover:bg-yellow-500 transition duration-300"
              >
                <Plus className="mr-2" /> <span>Add a new Address</span>
              </button>
            </div>
          </div>
          <div className="payment-container mt-10 px-4 py-6 bg-gray-800 shadow-md rounded-lg">
            <h1 className="text-xl font-bold text-white mb-2">
              Select Your Payment Method
            </h1>
            <p className="text-sm text-gray-400 mb-4">
              Your payment information is handled with the highest level of
              security and encryption standards, ensuring a safe and protected
              transaction experience.
            </p>
            {totalPrice > 1000 && (
              <div className="bg-yellow-600/10 border border-yellow-400 text-yellow-300 text-center py-2 px-3 rounded-lg mb-4">
                <p className="text-sm">
                  Cash on Delivery is available only for orders below{" "}
                  <span className="font-semibold">₹1000</span>.
                </p>
              </div>
            )}
            <h2 className="text-lg font-semibold text-gray-300 mb-3">
              Available Payment Methods
            </h2>
            <div className="payment-boxes flex gap-4">
              {totalPrice < 1000 && (
                <div className="payment-box text-center">
                  <div
                    className={`w-24 h-20 border-2 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                      selectedPaymentMethod === "Cash on Delivery"
                        ? "border-blue-400 bg-blue-600/20"
                        : "border-gray-600 bg-gray-700"
                    }`}
                    onClick={() => setSelectedPaymentMethod("Cash on Delivery")}
                  >
                    <img
                      className="w-full h-full object-cover rounded-md"
                      src="https://www.pngkey.com/png/detail/825-8250823_cash-on-delivery-cash-on-delivery-now-available.png"
                      alt="Cash on Delivery"
                    />
                  </div>
                  <p className="text-xs mt-2 font-medium text-gray-300">
                    Cash On Delivery
                  </p>
                </div>
              )}
              <div className="payment-box text-center">
                <div
                  className={`w-24 h-20 border-2 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                    selectedPaymentMethod === "Razorpay"
                      ? "border-blue-400 bg-blue-600/20"
                      : "border-gray-600 bg-gray-700"
                  }`}
                  onClick={() => setSelectedPaymentMethod("Razorpay")}
                >
                  <img
                    className="w-full h-full object-cover rounded-md"
                    src="https://media.tradly.app/images/marketplace/34521/razor_pay_icon-ICtywSbN.png"
                    alt="Online Payment"
                  />
                </div>
                <p className="text-xs mt-2 font-medium text-gray-300">
                  Online Payment
                </p>
              </div>
              <div className="payment-box text-center">
                <div
                  className={`w-24 h-20 border-2 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                    selectedPaymentMethod === "Wallet"
                      ? "border-blue-400 bg-blue-600/20"
                      : "border-gray-600 bg-gray-700"
                  }`}
                  onClick={() => setSelectedPaymentMethod("Wallet")}
                >
                  <img
                    className="w-full h-full object-cover rounded-md"
                    src="https://img.freepik.com/premium-vector/wallet-logo_701361-392.jpg"
                    alt="Online Payment"
                  />
                </div>
                <p className="text-xs mt-2 font-medium text-gray-300">Wallet</p>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="bg-green-700 text-white rounded-lg py-3 mt-6 w-full font-semibold text-lg hover:bg-green-600 transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>

        {/* Order Summary Section */}

        <div
          className="order-summary w-[40%] mt-16 rounded bg-slate-900 mb-5 p-5   overflow-y-auto"
          style={{ maxHeight: `${dynamicHeight}px` }}
        >
          <h1 className="font-bold text-xl text-white">Order Summary</h1>
          <div className="cart-products mt-3 flex flex-col gap-4">
            {products.map((product) => (
              <div
                key={product.product._id}
                className="product flex gap-5 items-center w-full border-b border-gray-700 pb-3"
              >
                <img
                  width="50"
                  height="50"
                  src={product.product.Images[0]}
                  alt={product.product.Name}
                  className="rounded"
                />
                <div className="flex flex-col gap-1 text-sm text-gray-200">
                  <h1 className="font-semibold">{product.product.Name}</h1>
                  <h1 className="text-gray-400">{product.variant.volume}</h1>
                  <h1 className="flex gap-3 items-center">
                    <span>
                      Qty: <b>{product.quantity}</b>
                    </span>
                    <span className="font-bold text-green-500">
                    ₹{" "}
                      {((product.variant.price -
                        (product.variant.price *
                          product.product.DiscountPercentage) /
                          100) *
                        product.quantity).toFixed(0)}
                    </span>
                  </h1>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-700 h-[2px] mt-5"></div>
          <div className="mt-5 text-white">
            <p className="flex justify-between font-bold text-lg">
              <span>Sub Total</span> <span>₹ {(totalPrice - (40 + (couponDiscount || 0))).toFixed(0)}
              </span>
            </p>

          {
            couponDiscount!==0&&  <p className="flex justify-between font-bold text-lg">
            <span>Coupon</span> <span>₹ {couponDiscount&&couponDiscount.toFixed(0)}</span>
          </p>
          }
            <p className="flex justify-between font-bold text-lg">
              <span>Delivery Fee</span> <span>₹ {40}</span>
            </p>
            <p className="flex justify-between font-bold text-xl mt-3">
              <span>Total</span>{" "}
              <span className="text-red-500">₹ {totalPrice.toFixed(0)}</span>
            </p>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-none h-screen w-screen"
      >
        <h1 className="text-center text-black text-2xl font-Bowly">
          Add new address
        </h1>
        <div className="w-[90%] md:w-[50%] lg:w-[35%] bg-slate-50 mx-auto rounded-lg h-[85%] overflow-auto">
          <form className="flex flex-col gap-2  py-4 text-black">
            <div className="flex flex-wrap mt-2 gap-1 justify-center">
              {inputsArray.map((input) => (
                <Input
                  key={input.label}
                  value={formState[input.label]} // Empty value for design
                  text={input.label}
                  type={input.type}
                  inputHandler={onInputHandler} // Placeholder function
                />
              ))}
            </div>
            <div className="ml-16">
              <h1 className="mb-2">Address Type</h1>
              <div className="address-radio flex gap-3 ">
                <div className="flex gap-2">
                  <input
                    value="home"
                    type="radio"
                    name="addressType"
                    id="home"
                    checked={addressType === "home"}
                    onChange={(e) => setAddressType(e.target.value)}
                  />
                  <p>Home</p>
                </div>

                <div className="flex gap-2">
                  <input
                    value="work"
                    type="radio"
                    name="addressType"
                    id="work"
                    checked={addressType === "work"}
                    onChange={(e) => setAddressType(e.target.value)}
                  />
                  <p>Work</p>
                </div>
                <div className="flex gap-2">
                  <input
                    value="Other"
                    type="radio"
                    name="addressType"
                    id="other"
                    checked={addressType === "Other"}
                    onChange={(e) => setAddressType(e.target.value)}
                  />
                  <p>Other</p>
                </div>
              </div>
            </div>
            <div className="buttons flex gap-3 mt-3 items-center ml-16">
              <button
                disabled={addressBtnToggle}
                onClick={(e) =>
                  onAddressHandler(e, isEditMode ? "Edit" : "Add")
                }
                type="button"
                className={`${
                  addressBtnToggle
                    ? "bg-blue-200 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-600 transition-colors duration-300"
                } text-white h-10 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300`}
              >
                {isEditMode ? "Edit" : "Create"}
              </button>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="blue uppercase text-blue-800 font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CheckOutPage;







