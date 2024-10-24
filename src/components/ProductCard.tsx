import React from 'react'
import { Link } from 'react-router-dom';
 import { IProduct } from '@/types/productTypes';
interface IProductCardProps{
  product:IProduct
}
 
const ProductCard : React.FC<IProductCardProps> = ({product}) => {


  return (
    <>
  <Link to={`/products/${product._id}`}>

     <div className="card-containaer h-[485px] bg-white   rounded-xl transition-transform transform overflow-hidden hover:scale-105">
        <div className="product-image  h-[68%] w-[100%] relative ">
        {product.Variants[0]?.stock===0 ? (
      <p className='absolute w-full top-[95%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] text-red-800 text-xl font-bold'>
       Out of Stock
      </p>
      
    ):product.Variants[0]?.stock<10 && <p className='absolute w-full top-[95%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] text-red-800 text-xl font-bold'>
  Only {product.Variants?.[0].stock} are left
   </p>}
        <img className='w-full h-full object-cover  object-center' src={product.Images[0]} alt="" />
        </div>
        <div className="product-details ml-3">
            <h1 className='font-gilroy font-bold text-left  text-lg mt-2 text-black'>{product.Name}</h1>
            <div className="rating flex gap-2  items-center">
            <img className='w-5 h-5 object-cover' src="https://cdn.iconscout.com/icon/free/png-512/free-star-icon-download-in-svg-png-gif-file-formats--favorite-award-rating-seo-pack-web-icons-2117160.png" alt="img" />
            <img className='w-5 h-5 object-cover' src="https://cdn.iconscout.com/icon/free/png-512/free-star-icon-download-in-svg-png-gif-file-formats--favorite-award-rating-seo-pack-web-icons-2117160.png" alt="img" />
            <img className='w-5 h-5 object-cover' src="https://cdn.iconscout.com/icon/free/png-512/free-star-icon-download-in-svg-png-gif-file-formats--favorite-award-rating-seo-pack-web-icons-2117160.png" alt="img" />
            <img className='w-5 h-5 object-cover' src="https://cdn.iconscout.com/icon/free/png-512/free-star-icon-download-in-svg-png-gif-file-formats--favorite-award-rating-seo-pack-web-icons-2117160.png" alt="img" />
            <img className='w-5 h-5 object-cover' src="https://cdn.iconscout.com/icon/free/png-512/free-star-icon-download-in-svg-png-gif-file-formats--favorite-award-rating-seo-pack-web-icons-2117160.png" alt="img" />
           <p className='font-gilroy text-lg text-black'>(4.9)</p>
 
            </div>
             
            <h1 className='text-xl font-bold font-Quando text-left text-black mt-2'>
            ₹{product.Variants[0].price|| 'Volume not available'}
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