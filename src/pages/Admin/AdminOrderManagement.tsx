import Pagination from "@/components/Pagination";
import api from "@/services/apiService";
import { AppHttpStatusCodes } from "@/types/statusCode";
import { AxiosError } from "axios";

import React, { useEffect, useState } from "react";

import { IOrder } from "@/types/orderTypes";
import { toast } from "sonner";
const AdminOrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[] | []>([]);
  const [paginatedOrders, setPaginatedOrders] = useState<IOrder[] | []>([]);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusChange = async (status: string, orderId: string) => {
    try {
      const res = await api.patch("/api/admin/orders", { status, orderId });
      const updatedOrders = orders.map((order) =>
        order._id === orderId
          ? { ...order, status: res.data.order.status }
          : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };

  const handleOnChangeOrderStatus = (status: string, orderId: string) => {
    toast.custom(
      (id) => (
        <div
          className="flex flex-col items-center p-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg rounded-lg border border-gray-300 transition-transform transform hover:scale-105"
          onClick={() => toast.dismiss(id)}
        >
          <p className="text-2xl font-bold">Confirm Action</p>
          <p className="text-sm mt-2 opacity-90">
            Are you sure you want to change the status?
          </p>
          <div className="flex space-x-4 mt-4">
            <button
              className="px-5 py-2 bg-blue-600 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              onClick={() => {
                handleStatusChange(status, orderId); // Call handleStatusChange on Yes
                toast.dismiss(id); // Dismiss toast
              }}
            >
              Yes
            </button>
            <button
              className="px-5 py-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
              onClick={() => toast.dismiss(id)} // Dismiss toast on No
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000, // Duration of the toast
      }
    );
  };

  const getAllOrders = async () => {
    try {
      const res = await api.get("/api/admin/orders");

      if (res.status === AppHttpStatusCodes.OK) {
        setOrders(res.data.orders);
        setPaginatedOrders(res.data.orders);
      }
    } catch (err) {}
  };

  const handleViewDetails = (order: IOrder) => {
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

  const handlePagination = (items: IOrder[]) => {
    setPaginatedOrders(items);
  };

  return (
    <div className="text-gray-700 container mx-auto h-full p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-bold mb-4">Order Management</h1>
     
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
                {order.user?.username}
              </td>
              <td className="border border-gray-200 p-2 text-left">
                {order.shippingAddress.Name},{order.shippingAddress.Locality}
                <br />
                {order.shippingAddress.District},{" "}
                {order.shippingAddress.State.toUpperCase()} -{" "}
                {order.shippingAddress.Pincode}
              </td>
              <td className="border border-gray-200 p-2 text-center font-bold">
                {" "}
                ₹{order.totalAmount.toFixed(0)}
              </td>
              <td className="border border-gray-200 p-2"> {new Date(order.orderDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}</td>
              <td className="border border-gray-200 p-2">
                {order.paymentMethod}
              </td>
              <td className="border border-gray-200 p-2">
                <select
                  disabled={
                    order.status === "Delivered" ||
                    order.status === "Returned" ||
                    order.status === "Cancelled"
                  }
                  value={order.status}
                  onChange={(e) =>
                    handleOnChangeOrderStatus(e.target.value, order._id)
                  }
                  className="border border-gray-300 rounded p-1"
                >
                  {order.status === "Delivered" ? (
                    <option value="Delivered">Delivered</option>
                  ) : order.status === "Confirmed" ? (
                    <>
                      <>
                        <option value="Delivered">Delivered</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                      </>
                    </>
                  ) : (
                  
                      <>
                        <option value="Pending">Pending</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Returned">Returned</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Shipped">Shipped</option>
                      </>
                   
                  )}
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
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-lg w-full transition-transform transform-gpu scale-95 hover:scale-100">
            <h2 className="text-3xl font-bold mb-6 text-blue-600 text-center">
              Order Details
            </h2>
            {selectedOrder && (
              <div>
                <div className="mb-6">
                  <p className="text-sm">
                    <strong className="text-gray-800">Order ID:</strong>{" "}
                    {selectedOrder._id}
                  </p>
                  <p className="text-sm">
                    <strong className="text-gray-800">User ID:</strong>{" "}
                    {selectedOrder.user.username}
                  </p>
                  <p className="text-sm">
                    <strong className="text-gray-800">Address:</strong>{" "}
                    {selectedOrder.shippingAddress.Name},{" "}
                    {selectedOrder.shippingAddress.Locality}
                    <br />
                    {selectedOrder.shippingAddress.District},{" "}
                    {selectedOrder.shippingAddress.State.toUpperCase()} -{" "}
                    {selectedOrder.shippingAddress.Pincode}
                  </p>
                  <p className="text-sm">
                    <strong className="text-gray-800">Total Price:</strong> $
                    {selectedOrder.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <strong className="text-gray-800">Date & Time:</strong>{" "}
                    {new Date(selectedOrder.orderDate).toLocaleString()}
                  </p>
                  <p className="text-sm">
                    <strong className="text-gray-800">Payment Method:</strong>{" "}
                    {selectedOrder.paymentMethod}
                  </p>
                  <p className="text-sm">
                    <strong className="text-gray-800">Status:</strong>{" "}
                    <span
                      className={`font-bold ${
                        selectedOrder.status === "COMPLETED"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedOrder.status}
                    </span>
                  </p>
                </div>

                <h3 className="font-bold mt-4 text-lg">Products:</h3>
                <ul className="list-disc list-inside">
                  {selectedOrder.items.map((item) => (
                    <li
                      key={item.productId}
                      className="flex items-center mb-4 bg-gray-100 p-3 rounded-lg shadow"
                    >
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="h-20 w-20 object-cover rounded mr-4 shadow-sm"
                      />
                      <div>
                        <span className="font-semibold text-lg">
                          {item.productName}
                        </span>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Price: $
                          {(
                            item.price -
                            (item.price * item.discountPercentage) / 100
                          ).toFixed(2)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              onClick={handleCloseModal}
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Pagination
        items={orders}
        itemsPerPage={7}
        onPageChange={handlePagination}
      />
    </div>
  );
};

export default AdminOrderManagement;
