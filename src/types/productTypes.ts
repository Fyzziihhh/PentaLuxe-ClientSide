 export interface IProduct {
    _id: string;
    CategoryId:{
      categoryName:string;
    }
    Name: string;
    Images: string[]; 
    Description: string;
    Gender?: "Men" | "Women" | "Unisex"; 
    ScentType: string;
    DiscountPercentage: number;
    Variants: {
      _id: string;
      volume: string;
      price: number;
      stock: number;
    }[];
    isBlocked:boolean;
  }