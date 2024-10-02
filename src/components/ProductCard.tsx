import React from 'react'
import { Link } from 'react-router-dom';
// import { MdOutlineStarPurple500 } from "react-icons/md";
interface IProduct{
    _id:string;
    productName: string; // Reference to Category
    productImages: string[];     
    productScentType: string;
    productDiscountPrice: number;
    productPriceStockQuantity:{
      volume:string;
      price:number;
      stock:number;
    }[];
    isBlocked?: boolean; 
}
interface IProductCardProps{
  product:IProduct
}
 
const ProductCard : React.FC<IProductCardProps> = ({product}) => {


  return (
    <>
  <Link to={`/products/${product._id}`}>

     <div className="card-containaer h-[485px] bg-white   rounded-xl overflow-hidden">
        <div className="product-image  h-[68%] w-[100%] ">
        <img className='w-full h-full object-cover  object-center' src={product.productImages[0]} alt="" />

        </div>
        <div className="product-details ml-3">
            <h1 className='font-gilroy font-bold text-left  text-lg mt-2 text-black'>{product.productName}</h1>
            <div className="rating flex gap-2  items-center">
            <img className='w-5 h-5 object-cover' src="https://cdn.iconscout.com/icon/free/png-512/free-star-icon-download-in-svg-png-gif-file-formats--favorite-award-rating-seo-pack-web-icons-2117160.png" alt="img" />
            <img className='w-5 h-5 object-cover' src="https://cdn.iconscout.com/icon/free/png-512/free-star-icon-download-in-svg-png-gif-file-formats--favorite-award-rating-seo-pack-web-icons-2117160.png" alt="img" />
            <img className='w-5 h-5 object-cover' src="https://cdn.iconscout.com/icon/free/png-512/free-star-icon-download-in-svg-png-gif-file-formats--favorite-award-rating-seo-pack-web-icons-2117160.png" alt="img" />
            <img className='w-5 h-5 object-cover' src="https://cdn.iconscout.com/icon/free/png-512/free-star-icon-download-in-svg-png-gif-file-formats--favorite-award-rating-seo-pack-web-icons-2117160.png" alt="img" />
            <img className='w-5 h-5 object-cover' src="https://cdn.iconscout.com/icon/free/png-512/free-star-icon-download-in-svg-png-gif-file-formats--favorite-award-rating-seo-pack-web-icons-2117160.png" alt="img" />
           <p className='font-gilroy text-lg text-black'>(4.9)</p>
 
            </div>
             
            <h1 className='text-xl font-bold font-Quando text-left text-black mt-2'>
      $ {product.productPriceStockQuantity[0].price|| 'Volume not available'}
    </h1>


        </div>
        <button className='bg-black text-white w-[90%] h-10 mt-2 font-Lilita rounded-xl'>
              ADD TO CART
        </button>
     </div>
     </Link>
    </>
  )
}

export default ProductCard