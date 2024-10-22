import DeleteModal from "@/components/DeleteModal";
import api from "@/services/apiService";
import { IAddress } from "@/types/AddressTypes";
import { AppHttpStatusCodes } from "@/types/statusCode";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface IOrder {
  _id: string;
  totalAmount: number;
  orderDate: string;
  paymentMethod: string;
  status: string;
  shippingAddress: IAddress;
  items: {
    productImage: string | undefined;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
}

const OrdersPage = () => {
const [item,setItem]=useState('')
  const navigate = useNavigate();
  const [orders, setOrders] = useState<IOrder[] | []>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const getUserOrders = async () => {
    const res = await api.get("/api/user/orders");
    if (res.status === AppHttpStatusCodes.OK) {
      setOrders(res.data.data);
    }
  };

  const viewOrderDetails = async (order: IOrder) => {
    navigate("/profile/orders/view-details", { state: { order } });
  };

  const openModal=(id:string)=>{
    setModalIsOpen(true)
    setItem(id)

    
 }
 const closeModal=()=>{
   setModalIsOpen(false)
 }


 const CancelOrder=async(id:string)=>{
 try {
  const res=await api.patch('/api/user/orders',{id})
  if(res.status===AppHttpStatusCodes.OK){
    toast.success(res.data.message)
  }
 } catch (error) {
  if(error instanceof AxiosError){
    toast.error(error.response?.data.message||"something went wrong while cancelling the order")
  }
 }
 }
  useEffect(() => {
    getUserOrders();
  }, []);
  return (
    <div className="-mt-6">
            <DeleteModal
        title="Order Cancellation Confirmation"
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        text="Are you sure you want to cancel this order?"
        onDelete={CancelOrder}
        item={item}
  
      />
      <h1 className="font-Quando text-3xl">My Orders</h1>
      <div className="orders mt-5">
        {orders.map((order: IOrder) => (
          <div className="order px-4 py-2 mt-2 bg-secondary relative ">
            {(order.status === "Pending" || order.status === "Confirmed") && (
              <button onClick={()=>openModal(order._id)} className="bg-red-800 p-1 rounded-lg absolute right-0">
                Cancel Order
              </button>
            )}

            <h1 className="font-Quando font-bold">Order {order._id}</h1>
            <h1>
              Date : {new Date(order.orderDate).toLocaleDateString("en-US")}
            </h1>
            <h1>
              status : <span className={`text-green-800`}>{order.status}</span>
            </h1>
            <div className="products flex flex-col gap-4">
              {order.items.map((item) => (
                <div key={item.productId} className="flex gap-5 mt-3">
                  <img
                    height={100}
                    width={100}
                    src={item.productImage}
                    alt="100x10 placeholder image"
                    className="rounded-md"
                  />
                  <div className="flex gap-2 flex-col ">
                    <h1 className="font-Quando">{item.productName}</h1>
                    <h1>Quantity : {item.quantity}</h1>
                    <h1>Price : ₹ {item.price} for each</h1>
                  </div>
                </div>
              ))}
              <h1 className="font-montserrat font-bold">
                Total : {order.totalAmount}
              </h1>
              <button
                onClick={() => viewOrderDetails(order)}
                className="bg-green-700 w-[15%] p-2 rounded-xl text-white"
              >
                {" "}
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
