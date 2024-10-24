import React, { useState, useEffect } from "react";

import { IProduct } from "@/types/productTypes";

interface ProductModalProps {
  product: IProduct | null;
  onClose: () => void;
  selectedVolume: string;
  hanldeCart:(productId:string,volume:string,stock:number)=>void
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, selectedVolume,hanldeCart }) => {
  const [selectedSize, setSelectedSize] = useState(selectedVolume);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(0);
  const [discountedPrice, setDiscountedPrice] = useState<number | undefined>(0);
 const [selectProductStock,setSelectedProductStock]=useState(0)
  // Update price based on the selected volume
  useEffect(() => {
    const variant = product?.Variants.find(variant => variant.volume === selectedSize);
    
    if (variant) {
        const currentPrice = variant.price;
        setOriginalPrice(currentPrice);
      const afterDiscount = variant.price - (variant.price * (product?.DiscountPercentage || 0)) / 100;
      setDiscountedPrice(afterDiscount);
      setSelectedProductStock(variant.stock)
    }
  }, [product, selectedSize]); 

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleSendCartData=()=>{
   product&& hanldeCart(product?._id,selectedSize,selectProductStock)
   
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 text-gray-600">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96 transform transition-all duration-300 scale-100">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500"
          >
            &#x2715;
          </button>

          <div className="flex items-center space-x-4">
            <img
              src={product?.Images[0]}
              alt={product?.Name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div>
              <h2 className="text-lg font-semibold">{product?.Name}</h2>
              <p className="text-sm text-gray-500 line-through">
                {originalPrice && `₹${originalPrice.toFixed(2)}`} {/* Original price */}
              </p>
              <p className="text-xl font-bold text-red-500">
                {discountedPrice && `₹${discountedPrice.toFixed(2)}`} {/* Discounted price */}
                <span className="text-sm text-gray-600 ml-2">
                  {product?.DiscountPercentage}% OFF
                </span>
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-gray-700 font-semibold">Select Volume (ml)</h3>
            <div className="flex space-x-3 mt-2">
              {product?.Variants.map((variant) => (
                <button
                  key={variant._id}
                  onClick={() => handleSizeSelect(variant.volume)}
                  className={`p-4 rounded-full border-2 text-sm ${
                    selectedSize === variant.volume
                      ? "border-pink-500 bg-pink-500 text-white"
                      : "border-gray-300"
                  }`}
                >
                  {variant.volume}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleSendCartData} className="mt-6 w-full bg-pink-500 text-white py-2 rounded-lg">
            Done
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductModal;
