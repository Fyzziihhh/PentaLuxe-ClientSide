import Pagination from "@/components/Pagination";
import api from "@/services/apiService";
import { IAddress } from "@/types/AddressTypes";
import { AppHttpStatusCodes } from "@/types/statusCode";
import { AxiosError } from "axios";
import { stat } from "fs";
import { User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
interface IOrder {
  _id: string;
  user: {
    username: string;
  };
  shippingAddress: IAddress;
  totalAmount: number;
  orderDate: string;
  paymentMethod: string;
  status: string;
  items:{
    productId:string;
    productName:string;
    quantity:number;
    price:number;
    subtotal:number
  }[]
}
const AdminOrderManagement = () => {
  const [orders, setOrders] = useState<IOrder[] | []>([]);
  const [paginatedOrders,setPaginatedOrders]=useState<IOrder[]|[]>([])
  const [selectedOrder, setSelectedOrder] = useState<IOrder|null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

    const handleStatusChange =async (status:string,orderId:string) => {
     try {
        const res=await api.patch('/api/admin/orders',{status,orderId})
        const updatedOrders = orders.map((order) => 
            order._id === orderId ? { ...order, status: res.data.order.status } : order
          );
          setOrders(updatedOrders);
     } catch (error) {
        if(error instanceof AxiosError){
            toast.error(error.response?.data.message)
        }
     }
    };

  const getAllOrders = async () => {
    try {
      const res = await api.get("/api/admin/orders");

      if (res.status === AppHttpStatusCodes.OK) {
        setOrders(res.data.orders);
        setPaginatedOrders(res.data.orders)
      }
    } catch (err) {}
  };

  const handleViewDetails = (order:IOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };
  useEffect(() => {
    getAllOrders();
  }, []);

  const handlePagination=(items:IOrder[])=>{
setPaginatedOrders(items)
  }

  return (
    <div className="text-gray-700 container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>
      <input
        type="text"
        placeholder="Search Orders..."
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="border border-gray-200 p-2">Order ID</th>
            <th className="border border-gray-200 p-2">User Name</th>
            <th className="border border-gray-200 p-2">Address</th>
            <th className="border border-gray-200 p-2">Total Price</th>
            <th className="border border-gray-200 p-2">Date & Time</th>
            <th className="border border-gray-200 p-2">Payment Method</th>
            <th className="border border-gray-200 p-2">Status</th>
            <th className="border border-gray-200 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders?.map((order, index) => (
            <tr key={index} className="hover:bg-gray-100 text-center">
              <td className="border border-gray-200 p-2">{order._id}</td>
              <td className="border border-gray-200 p-2">
                {order.user.username}
              </td>
              <td className="border border-gray-200 p-2 text-left">
                {order.shippingAddress.Name}, 
                {order.shippingAddress.Locality}
                <br />
                {order.shippingAddress.District}, {(order.shippingAddress.State).toUpperCase()}{" "}
                - {order.shippingAddress.Pincode}
              </td>
              <td className="border border-gray-200 p-2 text-center font-bold">
                {" "}
                ₹{order.totalAmount}
              </td>
              <td className="border border-gray-200 p-2">{order.orderDate}</td>
              <td className="border border-gray-200 p-2">
                {order.paymentMethod}
              </td>
              <td className="border border-gray-200 p-2">
                <select
                  value={order.status}
                  onChange={(e)=> handleStatusChange(e.target.value,order._id)}
                  className="border border-gray-300 rounded p-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Returned">Returned</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Shipped">Shipped</option>
                </select>
              </td>
              <td className="border border-gray-200 p-2">
                <button
                  onClick={() => handleViewDetails(order)}
                  className="text-blue-500 hover:underline"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

   
       {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            {selectedOrder && (
              <div>
                <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                <p><strong>User ID:</strong> {selectedOrder.user.username}</p>
                <p><strong>Address:</strong>  {selectedOrder.shippingAddress.Name}, 
                {selectedOrder.shippingAddress.Locality}
                <br />
                {selectedOrder.shippingAddress.District}, {(selectedOrder.shippingAddress.State).toUpperCase()}{" "}
                - {selectedOrder.shippingAddress.Pincode}</p>
                <p><strong>Total Price:</strong> {selectedOrder.totalAmount}</p>
                <p><strong>Date & Time:</strong> {selectedOrder.orderDate}</p>
                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <h3 className="font-bold mt-4">Products:</h3>
                <ul className="list-disc list-inside">
                  {selectedOrder.items.map((item) => (
                    <li key={item.productId}>
                      {item.productName} - Quantity: {item.quantity}, Price: {item.price}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              onClick={handleCloseModal}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )} 
      <Pagination items={orders} itemsPerPage={3} onPageChange={handlePagination}/>
    </div>
  );
};

export default AdminOrderManagement;
