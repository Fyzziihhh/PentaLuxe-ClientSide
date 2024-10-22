import { IProduct } from "./productTypes";

export interface Cart {
  variant:{
    stock:number;
    price:number;
    volume:string;
  }
    quantity: number;
    product: IProduct;
    
    _id: string;
  }