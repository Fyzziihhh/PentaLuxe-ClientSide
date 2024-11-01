import api from "@/services/apiService";
import { AppHttpStatusCodes } from "@/types/statusCode";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { IOrder } from "@/types/orderTypes";
import CancellationModal from "@/components/CancellationAndReturnableModal";
import { FileText, XCircle } from "lucide-react";
import jsPDF from "jspdf";

const OrdersPage = () => {
  const [item, setItem] = useState("");
  const navigate = useNavigate();
  const [orders, setOrders] = useState<IOrder[] | []>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const getUserOrders = async () => {
    const res = await api.get("/api/user/orders");
    if (res.status === AppHttpStatusCodes.OK) {
      setOrders(res.data.data);
    }
  };

  const viewOrderDetails = async (order: IOrder) => {
    navigate("/profile/orders/view-details", { state: { order } });
  };

  const openModal = (id: string, type: string, payment: string) => {
    setModalOpen(true);
    setItem(id);
    setModalType(type);
    setPaymentMethod(payment);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const CancelOrderOrReturnOrder = async (
    id: string,
    reason: string,
    payment: string
  ) => {
    try {
      const res = await api.patch("/api/user/orders", {
        id,
        reason,
        type: modalType,
        payment,
      });
      if (res.status === AppHttpStatusCodes.UNAUTHORIZED) {
        navigate("/login");
      }
      if (res.status === AppHttpStatusCodes.OK) {
        toast.success(res.data.message);
        const type = res.data.data;
        const status = type === "cancel" ? "Cancelled" : "Returned";
        const updatedOrders = orders.map((order) =>
          order._id === id ? { ...order, status } : order
        );
        setOrders(updatedOrders);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message ||
            "something went wrong while cancelling the order"
        );
      }
    }
  };

  const generateInvoicePDF=(order:IOrder)=>{
    const doc = new jsPDF();

// Constants for spacing
const lineHeight = 10; // Height between lines
const startY = 20; // Starting Y position for the invoice header
let currentY = startY;

// Header
doc.setFontSize(20);
doc.text("Invoice", 20, currentY);
currentY += lineHeight * 2; // Add some space after the header

// Order Details
doc.setFontSize(12);
doc.text(`Invoice Number: ${order._id}`, 20, currentY);
currentY += lineHeight; // Move down
doc.text(`Date: ${new Date(order.orderDate).toLocaleDateString()}`, 20, currentY);
currentY += lineHeight; // Move down
doc.text(`Status: ${order.status}`, 20, currentY);
currentY += lineHeight * 2; // Add space before user information

// User Information
doc.text(`Name: ${order.user.username}`, 20, currentY);
currentY += lineHeight; // Move down
doc.text(`Email: ${order.user.email}`, 20, currentY);
currentY += lineHeight * 2; // Add space before shipping address

// Shipping Address
doc.text("Shipping Address:", 20, currentY);
currentY += lineHeight; // Move down
doc.text(`${order.shippingAddress.Name}`, 20, currentY);
currentY += lineHeight; // Move down
doc.text(`${order.shippingAddress.FlatNumberOrBuildingName}`, 20, currentY);
currentY += lineHeight; // Move down
doc.text(`${order.shippingAddress.Locality}`, 20, currentY);
currentY += lineHeight; // Move down
doc.text(`${order.shippingAddress.District}`, 20, currentY);
currentY += lineHeight; // Move down
doc.text(`${order.shippingAddress.State}, ${order.shippingAddress.Pincode}`, 20, currentY);
currentY += lineHeight * 2; // Add space before item table

// Item Table Header
doc.text("Item Description", 20, currentY);
doc.text("Quantity", 150, currentY);
doc.text("Price", 180, currentY);
currentY += lineHeight; // Move down for item rows

// Item Rows
order.items.forEach(item => {
  doc.text(item.productName, 20, currentY);
  doc.text(item.quantity.toString(), 150, currentY);
  doc.text(`INR ${item.price.toFixed(2)}`, 180, currentY);
  currentY += lineHeight; // Move down for the next item
});


doc.text('Delivery Fee', 20, currentY);
doc.text('INR 40', 150, currentY);


// Total Amount
currentY += lineHeight; // Add space before total amount
doc.text("Total Amount: INR" + order.totalAmount, 20, currentY);
if (order.couponCode) {
  currentY += lineHeight; // Move down
  doc.text(`Coupon Code: ${order.couponCode}`, 20, currentY);
  currentY += lineHeight; // Move down
  doc.text(`Discount Applied: -$${order.couponDiscount}`, 20, currentY);
  currentY += lineHeight; // Move down
  doc.text("Final Amount: INR" + (order.totalAmount - order.couponDiscount), 20, currentY);
}

// Save the PDF
doc.save("invoice.pdf");

  }

  useEffect(() => {
    getUserOrders();
  }, []);
  return (
    <div className="-mt-6">
      <CancellationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={CancelOrderOrReturnOrder}
        item={item}
        type={modalType}
        payment={paymentMethod}
      />
      <h1 className="font-Quando text-3xl">My Orders</h1>
      <div className="orders mt-5">
        {orders.map((order: IOrder) => (
          <div className="order px-4 py-2 mt-2 bg-secondary relative ">
           {
            order.status==="Confirmed"||order.status==='Delivered'&&
            <button onClick={()=>generateInvoicePDF(order)} className="bg-green-800 text-white font-bold py-1 px-2 rounded-md hover:bg-green-700 transition duration-150 flex items-center absolute right-28">
            <FileText className="h-4 w-4 mr-1" />{" "}
          
            Invoice
          </button>
           }
            {(order.status === "Pending" ||
              order.status === "Confirmed" ||
              order.status === "Delivered") && (
              <button
                onClick={() =>
                  openModal(
                    order._id,
                    order.status === "Pending" || order.status === "Confirmed"
                      ? "cancel"
                      : "return",
                    order.paymentMethod
                  )
                }
                className="bg-red-600 text-white font-bold py-1 px-2 rounded-md hover:bg-red-700 transition duration-150 flex items-center absolute right-2"
              >
                <XCircle className="h-4 w-4 mr-1" />{" "}
                {/* Icon with size adjustment */}
                {order.status === "Pending" || order.status === "Confirmed"
                  ? "Cancel"
                  : order.status === "Delivered"
                  ? "Return"
                  : null}
              </button>
            )}

            <h1 className="font-Quando font-bold">Order {order._id}</h1>
            <h1>
              Date : {new Date(order.orderDate).toLocaleDateString("en-US")}
            </h1>
            <h1>
              status :{" "}
              <span
                className={`${
                  order.status === "Cancelled" || order.status === "Returned"
                    ? "text-red-800"
                    : "text-green-800"
                }`}
              >
                {order.status}
              </span>
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
                    <h1>
                      Price : ₹{" "}
                      {(
                        item.price -
                        (item.price * item.discountPercentage) / 100
                      ).toFixed(0)}{" "}
                      for each
                    </h1>
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
