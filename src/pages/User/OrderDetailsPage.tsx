import React from "react";
import { useLocation } from "react-router-dom";
import { IOrder } from "@/types/orderTypes";

const OrderDetailsPage : React.FC = () => {
  const location = useLocation();
  const order: IOrder = location.state.order;
  return (
    <div className="bg-secondary p-3 -mt-5">
      <h1 className="font-Quando text-xl">
        Order <span className="font-bold"> {order._id} </span> Details
      </h1>
      <h1>Date : {new Date(order.orderDate).toLocaleDateString("en-US")}</h1>
      <h1>Status: <span className={`${order.status!=="Cancelled"?"text-green-800":"text-red-800"} font-bold text-lg`}>{order.status}</span></h1>

      <div className="shipping-address">
        <h1 className="font-Quando mt-10 text-xl">Shipping Address</h1>
        <p className="mt-4 font-montserrat">
          <p className="font-bold"> {order.shippingAddress.Name} </p>
          {order.shippingAddress.FlatNumberOrBuildingName},{" "}
          {order.shippingAddress.Landmark},<br />
          {order.shippingAddress.Locality} ,{order.shippingAddress.District}{" "}
          <br />
          {order.shippingAddress.State} - {order.shippingAddress.Pincode}
        </p>
      </div>
      <h1 className="font-Quando mt-9 text-xl">Payment Method</h1>
      <h1 className="font-montserrat mt-1 ml-4">{order.paymentMethod}</h1>

      <div className="order-items flex flex-col gap-2">
        <h1 className="font-Quando text-xl mt-5">Order Items</h1>
        {order.items.map((item) => (
          <div key={item.productId} className="flex gap-5 mt-3">
            <img
              height={50}
              width={90}
              src={item.productImage}
              alt="100x10 placeholder image"
              className="rounded-md"
            />
            <div className="flex gap-2 flex-col ">
              <h1 className="font-Quando">{item.productName}</h1>
              <h1>Quantity : {item.quantity}</h1>
              <h1>Price : ₹ {(item.price -(item.price*item?.discountPercentage/100)).toFixed(0)} for each</h1>
            </div>
          </div>
        ))}
      </div>

      <div className="order-summary">
        <h1 className="font-Quando text-2xl mt-5">Order Summary</h1>
        <p className="font-montserrat font-bold">
          Subtotal: ₹ {order.totalAmount - 40}
        </p>
        <p className="font-montserrat font-bold">Shipping: ₹ 40</p>
        <div className="h-[1px] w-[20%] bg-slate-500 mt-3"></div>
        <h1 className="font-montserrat font-bold text-xl mt-2">
          Total : ₹ {order.totalAmount}
        </h1>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
