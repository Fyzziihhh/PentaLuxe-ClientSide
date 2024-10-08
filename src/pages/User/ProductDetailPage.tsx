import { useEffect, useState } from "react";
import api from "../../services/apiService";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { AppHttpStatusCodes } from "../../types/statusCode";
import { IProduct } from "@/types/productTypes";
import { useDispatch} from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
const ProductDetailPage = () => {
  const dispatch=useDispatch();
  const { id } = useParams();
  const [productPrice, setProductPrice] = useState<number|null>(null);
  // const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState<IProduct | undefined>(undefined);
  const [selectedVolume, setSelectedVolume] = useState<string | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  async function getProducts() {
    try {
      const response = await api.get(`/api/user/products/${id}`);
      if (response.data.success) {
        setProduct(response.data.product);
       

      
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

  // const getRelatedProducts = () => {};

  
  useEffect(() => {
    getProducts();
  }, []);
  
  // Set the first key as selected after product data is fetched
  useEffect(() => {
    if(product&&product.productPriceStockQuantity[0].volume){
      setSelectedVolume(product.productPriceStockQuantity[0].volume)
      setProductPrice(product.productPriceStockQuantity[0].price)
      
      
    }
  }, [product]);
  let stockQuantity = null;
  if (selectedVolume) {
    const selectedProduct = product?.productPriceStockQuantity.find(product => product.volume === selectedVolume);
    stockQuantity = selectedProduct ? selectedProduct.stock : null;
  }
  const AddToCart=async()=>{
  try {
    const res=await api.post('/api/user/cart',{productId:product?._id,price:Number(productPrice),volume:selectedVolume,stock:stockQuantity})
    if(res.status===AppHttpStatusCodes.OK){
      toast.success(res.data.message)
      dispatch(addToCart(res.data.product));
    }
  } catch (error) {
    if(error instanceof AxiosError){
      toast.error(error.response?.data.message)
    }
  }
  }


  return (
    <div className="text-white w-full p-5 ">
      <div className="product-detail-container h-full w-full flex justify-center items-center  py-2">
        <div className="product-image-section w-1/2 h-full flex items-center gap-5 justify-evenly">
          <div className="side-images-container flex flex-col gap-4">
            {product?.productImages.map((url, index) => (
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
          <div className="product-main-image w-[70%] h-5/6  rounded-lg overflow-hidden cursor-pointer px-4">
            <img
              className="w-full h-full object-cover border-2 rounded-xl"
              src={imageUrl ?? product?.productImages[0]}
              alt=""
            />
          </div>
        </div>

        <div className="product-info-section w-1/2 -mt-10   h-full ml-10">
          <div className="proudct-details w-full h-full  ">
            <h1 className="bold text-4xl font-Quando">
              {product?.productName}
            </h1>
            <div className="rating flex gap-2 mt-2">
              <img src="/assets/star.png" alt="" />
              <img src="/assets/star.png" alt="" />
              <img src="/assets/star.png" alt="" />
              <img src="/assets/star.png" alt="" />
              <img src="/assets/star.png" alt="" />
              <p className="font-bold">(5.0 rating | 200 reviews)</p>
            </div>
            <p className="w-[75%] mt-3 font-">{product?.productDescription}</p>

            <h1 className="price font-Bowly text-2xl mt-5">
              $ {productPrice}
            </h1>
            <div className="sizes mt-7">
            {product &&
  product.productPriceStockQuantity.map((val) => (
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
  ))
}
            </div>
          </div>
          <p className="mt-6 font-bold">
                Availability: 
                {stockQuantity !== null ? (
                    stockQuantity > 0 &&stockQuantity<=10? (
                        <span className="text-red-700">{` Only ${stockQuantity} stocks are left !!`}</span>
                    ) : (
                        stockQuantity===0?(
                          <span className="text-red-700">Out of Stock</span>
                        ):(<span > In Stock</span>)
                    )
                ) : (
                    <span>Please select a volume</span>
                )}
            </p>

          <div className="buttons flex gap-7 mt-6">
            <button onClick={AddToCart} className="flex font-Lilita bg-white text-black px-3 py-2 text-xl rounded-xl gap-2 items-center">
              ADD TO CART
              <img
                className="w-10 h-10"
                src="https://cdn.iconscout.com/icon/free/png-512/free-cart-icon-download-in-svg-png-gif-file-formats--grocery-store-shopping-shop-material-design-google-vol-3-pack-user-interface-icons-30488.png?f=webp&w=512"
                alt=""
              />
            </button>
            <button className="flex justify-center items-center font-Lilita text-xl  bg-[#F1C40F] text-white px-5 py-3 rounded-xl gap-4">
              <span>BUY NOW</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1792 1792"
                id="Cart"
                className="w-10 h-10"
              >
                <path
                  d="M1344 704q0-26-19-45t-45-19-45 19l-147 146V512q0-26-19-45t-45-19-45 19-19 45v293L813 659q-19-19-45-19t-45 19-19 45 19 45l256 256q19 19 45 19t45-19l256-256q19-19 19-45zm-640 832q0 53-37.5 90.5T576 1664t-90.5-37.5T448 1536t37.5-90.5T576 1408t90.5 37.5T704 1536zm896 0q0 53-37.5 90.5T1472 1664t-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm128-1088v512q0 24-16 42.5t-41 21.5L627 1146q1 7 4.5 21.5t6 26.5 2.5 22q0 16-24 64h920q26 0 45 19t19 45-19 45-45 19H512q-26 0-45-19t-19-45q0-14 11-39.5t29.5-59.5 20.5-38L332 384H128q-26 0-45-19t-19-45 19-45 45-19h256q16 0 28.5 6.5t20 15.5 13 24.5T453 329t5.5 29.5T463 384h1201q26 0 45 19t19 45z"
                  fill="#FEFEFF"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="related-Products-container">
        <h1 className="text-center font-Quando text-4xl mt-5">
          Related Products
        </h1>
        <div className="related-products"></div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
