import { IAddress } from "@/types/AddressTypes";
import Input from "@/components/Input/Input";
import { RootState, setCartProducts } from "@/store/slices/cartSlice";
// import { Cart } from "@/types/cartProductTypes";
import Modal from "react-modal";
import { Plus } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AppHttpStatusCodes } from "@/types/statusCode";
import api from "@/services/apiService";
import { AxiosError } from "axios";
import { toast } from "sonner";


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
 
  const [isEditMode, setIsEditMode] = useState(false);
  const [addressId, setAddressId] = useState("");

  const [addressType, setAddressType] = useState("");
  const [addresses, setAddresses] = useState<IAddress[] | []>([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const products = useSelector((state: RootState) => state.cart.products);
  const totalPrice = location.state?.totalPrice || 0;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formState, setFormState] = useState<Record<FormKeys, string>>({
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

  // const handleCheckOutPayment = async () => {
  //   try {
  //     const {
  //       data: { key },
  //     } = await api.get("/api/user/getkey");
  //     const {
  //       data: {data: order },
  //     } = await api.post("/api/user/checkout", { totalPrice });

  //     const options = {
  //       key,
  //       amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
  //       currency: "INR",
  //       name: "PentaLuxe Ecommerce",
  //       description: "Test Transaction",
  //       image: "https://www.facebook.com/pentalux.com.tr/",
  //       order_id: order.id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
  //       callback_url: "http://localhost:7000/api/user/payment-verification",
  //       prefill: {
  //         name: "PentaLuxe Ecommerce",
  //         email: "gaurav.kumar@example.com",
  //         contact: "9000090000",
  //       },
  //       notes: {
  //         address: "Razorpay Corporate Office",
  //       },
  //       theme: {
  //         color: "#3399cc",
  //       },
  //     };
  //     console.log(window);
  //     const razor = new window.Razorpay(options);
  //     razor.open();
  //   } catch (error) {
  //     if (error instanceof AxiosError) {
  //       toast.error(error.response?.data.message);
  //     }
  //   }
  // };



  const onInputHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setFormState((prevState) => ({
      ...prevState,
      [name as FormKeys]: value,
    }));
  };

  const onAddressHandler = async (e: FormEvent, action: string = "Add") => {
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
        const address: IAddress = res.data.address;
        console.log("Address", address);
        setIsModalOpen(false);
        setAddresses((prev) => [...prev, address]);
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

  const handleEditAddress = (id: string) => {
    setIsEditMode(true);

    // Example logic to fetch address details based on id
    const addressToEdit = addresses.find((address) => address._id === id);

    setAddressId(id);

    if (addressToEdit) {
      setFormState(addressToEdit);
      setAddressType(addressToEdit.addressType);
      setIsModalOpen(true);
    } else {
      toast.error("Address not found!");
    }
  };

  const handlePlaceOrder = async () => {
    // if (isProcessing) return;
    // setIsProcessing(true);

    const items = products.map((product) => ({
      productId: product.product._id,
      productName: product.product.Name,
      quantity: product.quantity,
      price: product.variant.price,
      subtotal: product.variant.price * product.quantity,
      productImage: product.product.Images[0],
    }));

    const orderDetails = {
      addressId: selectedAddress,
      items,
      paymentMethod: selectedPaymentMethod,
      totalAmount: totalPrice,
    };

    try {
      if (selectedPaymentMethod === "Razorpay") {
        await handleRazorpayPayment(orderDetails);
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
        console.log("skljflslslflslflsl");
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

  useEffect(() => {
    getUserAddresses();
 
  }, []);

  return (
    <div className="w-full   px-32 pb-5">
      <h1 className="font-Quando  text-4xl  underline underline-offset-8">
        Checkout
      </h1>
      <div className="container flex gap-9">
        {/*Address Section */}

        <div className="w-[60%] address-session">
          <h1 className="mt-5 font-bold text-2xl">Select a Delivery Address</h1>
          <div className="w-full bg-secondary rounded px-5 py-3 mt-3">
            <h1 className="font-bold">Your Addresses </h1>
            <div className="w-full h-[1px] bg-gray-500"></div>

            <div className="addresses mt-2 flex flex-col gap-2 items-start">
              {addresses.map((address: IAddress) => (
                <div
                  key={address?._id}
                  className="address flex items-start gap-2 border p-3 rounded hover:bg-blue-950 cursor-pointer"
                  onClick={() => setSelectedAddress(address?._id)}
                >
                  <input
                    className="mt-2"
                    type="radio"
                    name="address"
                    id={`address-${address?._id}`}
                    value={address?._id}
                    checked={selectedAddress === address?._id}
                    onChange={handleAddressChange}
                  />
                  <p>
                    {address?.Name}, {address?.FlatNumberOrBuildingName}
                    {address?.Landmark}, {address?.Locality},{" "}
                    {address?.District}, {address?.State}, {address?.Pincode}
                    <span
                      className="ml-5 text-blue-700"
                      onClick={() => handleEditAddress(address?._id)}
                    >
                      Edit
                    </span>
                  </p>
                </div>
              ))}
              <button
                onClick={() => {
                  setIsEditMode(false);
                  setIsModalOpen(true);
                }}
                className="flex font-bold bg-yellow-600 p-2 rounded-md items-center justify-center mt-8"
              >
                <Plus /> <span>Add a new Address</span>
              </button>
            </div>
          </div>
          <div className="Payment Contanier mt-10">
            <h1 className="font-bold">Payment Method </h1>
            <p>All transactions are secure and encrypted</p>

            <div className="payment-boxes flex gap-2 text-[10px]">
              <div className="payment-box">
                <div
                  className={` w-20 h-16 border-2 flex cursor-pointer mt-3 ${
                    selectedPaymentMethod === "Cash on Delivery"
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedPaymentMethod("Cash on Delivery")}
                >
                  <img
                    className="w-full h-full object-cover"
                    src="https://www.pngkey.com/png/detail/825-8250823_cash-on-delivery-cash-on-delivery-now-available.png"
                    alt=""
                  />
                </div>
                <p>Cash On Delivery</p>
              </div>
              <div className="payment-box">
                <div
                  className={` w-20 h-16 border-2 flex cursor-pointer mt-3 bg-white ${
                    selectedPaymentMethod === "Razorpay"
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedPaymentMethod("Razorpay")}
                >
                  <img
                    className="w-full h-full object-cover"
                    src="https://media.tradly.app/images/marketplace/34521/razor_pay_icon-ICtywSbN.png"
                    alt=""
                  />
                </div>
                <p>Online Payment</p>
              </div>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="bg-green-900  rounded-xl py-3 mt-5 w-[50%] font-bold text-lg font-montserrat hover:bg-green-950"
          >
            Place Order
          </button>
        </div>
        {/* Order Summary Section*/}
        <div className="order-summary w-[40%] mt-16 rounded  bg-slate-900 mb-5 p-5">
          <h1 className="font-bold text-xl">Order Summary</h1>
          <div className="cart-products mt-3 flex flex-col gap-2">
            {products.map((product) => (
              <div className="product flex gap-5 items-center  w-full pb-5">
                <img
                  width="50"
                  height="50"
                  src={product.product.Images[0]}
                  alt=""
                  className="rounded"
                />
                <div className="flex flex-col gap-1 text-sm">
                  <h1>{product.product.Name}</h1>
                  <h1>{product.variant.volume}</h1>
                  <h1 className="flex gap-5">
                    <span>
                      Qty : <b>{product.quantity}</b>
                    </span>
                    -{" "}
                    <span className="font-bold">
                      {product.variant.price * product.quantity}
                    </span>
                  </h1>
                </div>
              </div>
            ))}
          </div>
         
      
          <div className="bg-gray-400 h-[2px] mt-5 "></div>

          <div>
            <p className="flex justify-between font-bold mt-5">
              <span className="text-xl font-montserrat">Sub Total</span>{" "}
              <span>INR {totalPrice}</span>
            </p>
            <p className="flex justify-between font-bold mt-5">
              <span className="text-xl font-montserrat">Total</span>{" "}
              <span className="text-red-700 font-montserrat text-xl">
                INR {totalPrice}
              </span>
            </p>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-none"
      >
        <h1 className="text-center text-black text-3xl font-Bowly">
          Add new address
        </h1>
        <div className="w-[30%] bg-white mx-auto">
          <form className="flex  flex-col gap-3 ml-7 text-black pb-5">
            <div className="flex flex-wrap mt-5 gap-2">
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
            <div>
              <h1>Address Type</h1>
              <div className="address-radio flex gap-5">
                <div className="flex gap-2">
                  <input
                    value="home" // Set the value specific to this option
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
                    checked={addressType === "work"} // This ensures the correct radio button is checked
                    onChange={(e) => setAddressType(e.target.value)}
                  />
                  <p>Work</p>
                </div>
                <div className="flex gap-2">
                  <input
                    value="Other" // Set the value specific to this option
                    type="radio"
                    name="addressType"
                    id="home"
                    checked={addressType === "Other"}
                    onChange={(e) => setAddressType(e.target.value)}
                  />
                  <p>Other</p>
                </div>
              </div>
            </div>
            <div className="buttons flex gap-5 mt-5 items-center">
              <button
                onClick={(e) =>
                  onAddressHandler(e, isEditMode ? "Edit" : "Add")
                }
                type="button"
                className="bg-blue-700 text-white h-10 px-16"
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
