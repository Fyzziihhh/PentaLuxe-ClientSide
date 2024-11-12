import { useEffect, useState } from "react";
import api from "../../services/apiService";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { AppHttpStatusCodes } from "../../types/statusCode";
import { IProduct } from "@/types/productTypes";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ProductCard from "@/components/ProductCard";
const ProductDetailPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [productPrice, setProductPrice] = useState<number | null>(null);

  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState<IProduct | undefined>(undefined);
  const [selectedVolume, setSelectedVolume] = useState<string | null>(null);
  const [wishlistToggle, setWishlistToggle] = useState(false);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  async function getProducts() {
    try {
      const response = await api.get(`/api/user/products/${id}`);
      if (response.data.success) {
        const { data: product } = response.data;
        setProduct(product);
      }
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
    }
  }
  const ImageHandler = (url: string) => {
    setImageUrl(url);
  };

  const productPriceHandler = (price: number) => {
    setProductPrice(price);
  };

  

  // Set the first key as selected after product data is fetched

  const AddToCart = async () => {
    try {
      const res = await api.post("/api/user/cart", {
        productId: product?._id,
        volume: selectedVolume,
        stock: stockQuantity,
      });
      if (res.status === AppHttpStatusCodes.OK) {
        toast.success(res.data.message);
        dispatch(addToCart(res.data.data));
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === AppHttpStatusCodes.UNAUTHORIZED) {
          navigate("/login");
        }
        toast.error(error.response?.data.message);
      }
    }
  };

  const addToWishlist = async () => {
    try {
      setWishlistToggle((prev) => !prev);
      const res = await api.post("/api/user/wishlist", {
        productId: product?._id,
        variant: selectedVolume,
      });

      if (res.status == AppHttpStatusCodes.CREATED) {
        toast.success(res.data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };

  const removeFromWishlist = async (id: string | null) => {
    try {
      const res = await api.delete(`/api/user/wishlist/${id}`);
      if (res.status === AppHttpStatusCodes.OK) {
        toast.success(res.data.message);
        setWishlistToggle((prev) => !prev);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };
  const checkProductInWishlist = async () => {
    const res = await api.get(`/api/user/wishlist/${id}`);
    if (res.status === AppHttpStatusCodes.OK) {
      if (res.data.success) {
        setWishlistToggle(true);
      }
    }
  };
  useEffect(() => {
    if (!product || !product.Variants || !selectedVolume) return;

    const variant = product.Variants.find(
      (variant) => variant.volume === selectedVolume
    );

    if (variant && product.DiscountPercentage) {
      const discountAmount = (variant.price * product.DiscountPercentage) / 100;
      const finalPrice = variant.price - discountAmount;

      setDiscountPrice(Math.round(finalPrice));
    }
  }, [selectedVolume, product]);

  const fetchRelatedProducts = async (category: string) => {
    try {
      const res = await api.post('/api/user/related-products',{categoryName:category} );
      if (res.status === AppHttpStatusCodes.OK) {
        setRelatedProducts(res.data.data);
      }
      
    } catch (error) {
      if(error instanceof AxiosError){
        toast.error(error.response?.data.message)

      }
    }
  };

  useEffect(() => {
    getProducts();
    checkProductInWishlist();
    if (product) {
      fetchRelatedProducts(product.CategoryId.categoryName);
    }
  }, []);

  useEffect(() => {
    if (product && product.Variants[0].volume) {
      setSelectedVolume(product.Variants[0].volume);
      setProductPrice(product.Variants[0].price);
    }
  }, [product]);
  let stockQuantity: number | null = null;
  if (selectedVolume) {
    const selectedProduct = product?.Variants.find(
      (product) => product.volume === selectedVolume
    );
    stockQuantity = selectedProduct ? selectedProduct.stock : null;
  }
  return (
    <div className="text-white w-full p-5 ">
      <div className="product-detail-container h-full w-full flex justify-center items-center  py-2">
        <div className="product-image-section w-1/2 h-full flex items-center gap-5 justify-evenly">
          <div className="side-images-container flex flex-col gap-4">
            {product?.Images.map((url, index) => (
              <div
                onClick={() => {
                  ImageHandler(url);
                  setSelectedImageIndex(index);
                }}
                key={index}
                className={`side-images ${
                  selectedImageIndex === index
                    ? "border-4 border-yellow-300"
                    : ""
                }`}
              >
                <img src={url} alt="" />
              </div>
            ))}
          </div>
          <div className="product-main-image w-[70%] h-5/6 rounded-lg overflow-hidden cursor-pointer px-4 relative">
            <button
              className="absolute top-0 right-5 z-10"
              onClick={() => {
                wishlistToggle
                  ? product && removeFromWishlist(product?._id)
                  : addToWishlist();
              }}
            >
              {wishlistToggle ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="3em"
                  height="3em"
                  viewBox="0 0 24 24"
                  className="text-red-500"
                >
                  <path
                    fill="currentColor"
                    d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="3em"
                  height="3em"
                  viewBox="0 0 24 24"
                  className="text-red-500"
                >
                  <path
                    fill="currentColor"
                    d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3"
                  />
                </svg>
              )}
            </button>

            <TransformWrapper initialScale={1}>
              <TransformComponent>
                <img
                  className="w-full h-full object-cover border-2 rounded-xl"
                  src={imageUrl ?? product?.Images[0]}
                  alt=""
                />
              </TransformComponent>
            </TransformWrapper>
          </div>
        </div>

        <div className="product-info-section w-1/2    h-full ml-10">
          <div className="proudct-details w-full h-full  ">
            <h1 className="bold text-4xl font-Quando">{product?.Name}</h1>
            <div className="rating flex gap-2 mt-2">
              <img src="/assets/star.png" alt="" />
              <img src="/assets/star.png" alt="" />
              <img src="/assets/star.png" alt="" />
              <img src="/assets/star.png" alt="" />
              <img src="/assets/star.png" alt="" />
              <p className="font-bold">(5.0 rating | 200 reviews)</p>
            </div>
            <p className="w-[75%] mt-3 font-">{product?.Description}</p>

            <h1 className="price font-Bowly text-xl mt-5 text-gray-600 flex gap-2 items-center">
              {/* Original price with subtle strike-through */}
              <span className="line-through text-gray-400">
                ₹{productPrice}
              </span>

              {/* Discount percentage with softer color */}
              <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded-md text-base font-medium">
                {product?.DiscountPercentage}% OFF
              </span>
            </h1>

            <h1 className="price font-Bowly text-2xl ">₹{discountPrice}</h1>
            <div className="sizes mt-7">
              {product &&
                product.Variants.map((val) => (
                  <span
                    onClick={() => {
                      productPriceHandler(val.price);
                      setSelectedVolume(val.volume);
                    }}
                    className={`bg-white text-black p-2 py-3 rounded-md ml-2 font-Bowly cursor-pointer
        ${selectedVolume === val.volume ? "border-2 border-yellow-400" : ""}
      `}
                    key={val._id}
                  >
                    {val.volume}
                  </span>
                ))}
            </div>
          </div>
          <p className="mt-6 font-bold">
            Availability:
            {stockQuantity !== null ? (
              stockQuantity > 0 && stockQuantity <= 10 ? (
                <span className="text-red-700">{` Only ${stockQuantity} stocks are left !!`}</span>
              ) : stockQuantity === 0 ? (
                <span className="text-red-700">Out of Stock</span>
              ) : (
                <span> In Stock</span>
              )
            ) : (
              <span>Please select a volume</span>
            )}
          </p>

          <div className="buttons flex gap-7 mt-6">
            <button
              onClick={AddToCart}
              className="flex font-Lilita bg-white text-black px-3 py-2 text-xl rounded-xl gap-2 items-center"
            >
              ADD TO CART
              <img
                className="w-10 h-10"
                src="https://cdn.iconscout.com/icon/free/png-512/free-cart-icon-download-in-svg-png-gif-file-formats--grocery-store-shopping-shop-material-design-google-vol-3-pack-user-interface-icons-30488.png?f=webp&w=512"
                alt=""
              />
            </button>

          </div>
        </div>
      </div>
      <div className="related-Products-container">
        <h1 className="text-center font-Quando text-4xl mt-5">
          Related Products
        </h1>
        <div className="related-products flex flex-wrap">
  {
    relatedProducts.map(product=><ProductCard product={product}/>)
  }
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
