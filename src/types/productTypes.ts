 export interface IProduct {
    _id: string;
    productName: string;
    productImages: string[]; 
    productDescription: string;
    gender?: "Men" | "Women" | "Unisex"; 
    productScentType: string;
    productDiscountPrice: number;
    productPriceStockQuantity: {
      _id: string;
      volume: string;
      price: number;
      stock: number;
    }[];
  }