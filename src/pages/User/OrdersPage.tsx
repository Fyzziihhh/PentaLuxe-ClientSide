import api from "@/services/apiService";
import { AppHttpStatusCodes } from "@/types/statusCode";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { IOrder } from "@/types/orderTypes";
import CancellationModal from "@/components/CancellationAndReturnableModal";
import {
  
  AlertTriangle,
  FileText,
  RefreshCcw,
  XCircle,
} from "lucide-react";
import jsPDF from "jspdf";
import Pagination from "@/components/Pagination";

const OrdersPage = () => {
  const [item, setItem] = useState("");
  const navigate = useNavigate();
  const [orders, setOrders] = useState<IOrder[] | []>([]);
  const [displayOrders, setDisplayOrders] = useState<IOrder[] | []>([]);
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

  const generateInvoicePDF = (order: IOrder) => {
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
    doc.text(
      `Date: ${new Date(order.orderDate).toLocaleDateString()}`,
      20,
      currentY
    );
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
    doc.text(
      `${order.shippingAddress.State}, ${order.shippingAddress.Pincode}`,
      20,
      currentY
    );
    currentY += lineHeight * 2; // Add space before item table

    // Item Table Header
    doc.text("Item Description", 20, currentY);
    doc.text("Quantity", 150, currentY);
    doc.text("Price", 180, currentY);
    currentY += lineHeight; // Move down for item rows

    // Item Rows
    order.items.forEach((item) => {
      doc.text(item.productName, 20, currentY);
      doc.text(item.quantity.toString(), 150, currentY);
      doc.text(`${item.price.toFixed(2)} Rs`, 180, currentY);
      currentY += lineHeight; // Move down for the next item
    });

    doc.text("Delivery Fee", 20, currentY);
    doc.text("40", 150, currentY);

    // Total Amount
    currentY += lineHeight; // Add space before total amount
    doc.text(`Total Amount:  ${order.totalAmount.toFixed(0)} Rs`, 20, currentY);
    if (order.couponCode) {
      currentY += lineHeight; // Move down
      doc.text(`Coupon Code: ${order.couponCode} `, 20, currentY);
      currentY += lineHeight; // Move down
      doc.text(
        `Discount Applied: - ${order.couponDiscount.toFixed(0)} Rs`,
        20,
        currentY
      );
      currentY += lineHeight; // Move down
      doc.text(
       ` Final Amount:  ${(order.totalAmount - order.couponDiscount).toFixed(0)} Rs`,
        20,
        currentY
      );
    }

    // Save the PDF
    doc.save("invoice.pdf");
  };

  const handlePagination = (items: IOrder[]) => {
    setDisplayOrders(items);
  };

  const retryPayment = async (
    orderId: string,
    totalPrice: number,
    orderItems: any
  ) => {
    for (let item of orderItems) {
      for (let variant of item.productId.Variants) {
        if (variant.stock < 1) {
          toast.error(
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ marginRight: "10px" }}>
                <AlertTriangle color="#FF4D4D" size={30} />
              </div>
              <div>
                <strong>The variant "{variant.volume}"</strong> of{" "}
                <strong>{item.productId.Name}</strong> is currently out of
                stock. Please check back later.
              </div>
            </div>,
            {
              duration: 5000, // Duration before auto dismiss
              style: {
                backgroundColor: "#f44336", // Customize background color
                color: "#fff", // Customize text color
                borderRadius: "8px", // Rounded corners
                padding: "10px", // Padding around the toast
              },
            }
          );

          return;
        }
      }
    }

    const {
      data: { data: key },
    } = await api.get("/api/user/getkey");
    const {
      data: { data: order },
    } = await api.post("/api/user/create-razorpay-order", { totalPrice });

    const options = {
      key,
      amount: order?.amount,
      currency: "INR",
      name: "PentaLuxe Ecommerce",
      description: "Order Payment",
      order_id: order.id,
      handler: async function (response: any) {
        await api.put("/api/user/order-retry-payment", {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          orderId,
          retryPayment: true,
        });
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
  };
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
      {orders.length < 1 ? (
  <div className="flex items-center p-5 bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-800 text-white rounded-xl shadow-2xl max-w-lg mx-auto my-8">
    <AlertTriangle className="w-10 h-10 mr-5 text-yellow-400" />
    <p className="text-lg font-semibold">There are no orders. Are you sure you like this?</p>
  </div>
) : (
  (displayOrders.length > 0 ? displayOrders : orders).map((order: IOrder) => (
    <div className="order px-4 py-2 mt-2 bg-secondary relative">
      {order.status === "Payment Failed" && (
        <button
          onClick={() => retryPayment(order._id, order.totalAmount, order.items)}
          className="bg-blue-600 text-white font-bold py-1 px-2 rounded-md hover:bg-blue-500 transition duration-150 flex items-center absolute right-5"
        >
          <RefreshCcw className="h-4 w-4 mr-1" />
          Retry Payment
        </button>
      )}
      
      {(order.status === "Confirmed" || order.status === "Delivered") && (
        <button
          onClick={() => generateInvoicePDF(order)}
          className="bg-green-800 text-white font-bold py-1 px-2 rounded-md hover:bg-green-700 transition duration-150 flex items-center absolute right-28"
        >
          <FileText className="h-4 w-4 mr-1" /> Invoice
        </button>
      )}
      
      {(order.status === "Pending" || order.status === "Confirmed" || order.status === "Delivered") && (
        <button
          onClick={() => openModal(order._id, order.status === "Pending" || order.status === "Confirmed" ? "cancel" : "return", order.paymentMethod)}
          className="bg-red-600 text-white font-bold py-1 px-2 rounded-md hover:bg-red-700 transition duration-150 flex items-center absolute right-2"
        >
          <XCircle className="h-4 w-4 mr-1" />
          {order.status === "Pending" || order.status === "Confirmed" ? "Cancel" : "Return"}
        </button>
      )}

      <h1 className="font-Quando font-bold">Order {order._id}</h1>
      <h1>Date: {new Date(order.orderDate).toLocaleDateString("en-US")}</h1>
      <h1>
        Status: <span className={order.status === "Cancelled" || order.status === "Returned" ? "text-red-800" : "text-green-800"}>{order.status}</span>
      </h1>

      <div className="products flex flex-col gap-4">
        {order.items.map((item) => (
          <div key={item.productId} className="flex gap-5 mt-3">
            <img height={100} width={100} src={item.productImage} alt={item.productName} className="rounded-md" />
            <div className="flex gap-2 flex-col">
              <h1 className="font-Quando">{item.productName}</h1>
              <h1>Quantity: {item.quantity}</h1>
              <h1>Price: ₹ {item.price.toFixed(0)} each</h1>
            </div>
          </div>
        ))}
        <h1 className="font-montserrat font-bold">Total: ₹ {order.totalAmount.toFixed(0)}</h1>
        <button
          onClick={() => viewOrderDetails(order)}
          className="bg-green-700 w-[15%] p-2 rounded-xl text-white"
        >
          View Details
        </button>
      </div>
    </div>
  ))
)}

      </div>
      {orders.length > 0 && (
        <Pagination
          items={orders}
          itemsPerPage={3}
          onPageChange={handlePagination}
        />
      )}
    </div>
  );
};

export default OrdersPage;
