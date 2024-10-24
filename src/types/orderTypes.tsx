import { IAddress } from "./AddressTypes";

export interface IOrder {
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
      productImage:string;
      quantity:number;
      price:number;
      subtotal:number
    }[];
    couponDiscount:number;
  }