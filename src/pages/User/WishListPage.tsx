import EmptyWishlist from "@/components/EmptyWishlist";
import ProductModal from "@/components/ProductDetailsModal";
import api from "@/services/apiService";
import { addToCart } from "@/store/slices/cartSlice";
import { IProduct } from "@/types/productTypes";
import { AppHttpStatusCodes } from "@/types/statusCode";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Sample Wishlist Data

interface IWishlistItems {
  _id: string;
  product: IProduct;
  variant: {
    volume: string;
    price: number;
  };
}

const WishlistPage = () => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const [isModalOpen, setModalOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<IWishlistItems[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [selectedVolume, setSelectedVolume] = useState("");
  const getUserWishlist = async () => {
    const res = await api.get("/api/user/wishlist");
    console.log("wishlist", res.data);
    if (res.status === AppHttpStatusCodes.OK) {
      setWishlistItems(res.data.data);
    }
  };

  const showProductModalWithVolume = (product: IProduct, volume: string) => {
    setModalOpen(true);
    setSelectedProduct(product);
    setSelectedVolume(volume);
  };

  const AddToCart = async (productId: string, volume: string, stock: number) => {
    try {
      const res = await api.post("/api/user/cart", {
        productId,
        volume,
        stock
      });
      if (res.status === AppHttpStatusCodes.OK) {
        setModalOpen(false)
        toast.success(res.data.message);
        
        dispatch(addToCart(res.data.data));
        navigate('/cart')
        
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };

  const removeFromWishlist=async(id:string)=>{
    try {
      const response = await api.delete(`/api/user/wishlist/${id}`);
      if(response.status===AppHttpStatusCodes.OK){
         toast.success(response.data.message)
       const updatedWishlist=  wishlistItems.filter(item=>item._id.toString()
       ===id)
       setWishlistItems(updatedWishlist)
      }
    } catch (error) {
      
    }
  }

  useEffect(() => {
    getUserWishlist();
  }, []);

  return (
 <div className="w-full">
{wishlistItems.length===0|| !wishlistItems?<EmptyWishlist/>:   <div className="max-w-6xl mx-auto p-8">
      {isModalOpen && (
        <ProductModal
          product={selectedProduct}
          selectedVolume={selectedVolume}
          onClose={() => setModalOpen(false)}
      hanldeCart={AddToCart}
          
        />
      )}

      <h1 className="text-4xl font-bold mb-8 text-center">Your Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {wishlistItems?.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
          >
            <Link to={`/products/${item.product._id}`} className="w-full ">
              {" "}
              <img
                src={item.product.Images[0]}
                alt={item.product.Name}
                className="w-full h-56 object-contain border-b-2 border-gray-100"
              />
            </Link>

            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {item.product.Name}
              </h2>
              <p className="text-lg text-gray-600 mt-2">
                {" "}
                ₹{item.variant.price || "skldjlkf"}
              </p>
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() =>
                    showProductModalWithVolume(
                      item.product,
                      item.variant.volume
                    )
                  }
                  className="bg-blue-500 text-white px-6 py-2 rounded-full shadow hover:bg-blue-600 transition duration-300"
                >
                  Move to Cart
                </button>
                <button onClick={()=>removeFromWishlist(item.product._id)} className="bg-red-500 text-white px-6 py-2 rounded-full shadow hover:bg-red-600 transition duration-300">
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>}
 </div>
    
 
  );
};

export default WishlistPage;







