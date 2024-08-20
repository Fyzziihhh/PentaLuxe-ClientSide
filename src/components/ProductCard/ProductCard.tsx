import React from 'react'
import { MdOutlineStarPurple500 } from "react-icons/md";
interface ProductCardProps{
    src:string;
}
const ProductCard : React.FC<ProductCardProps> = ({src}) => {
  return (
    <>
     <div className="card-containaer w-[400px] h-[480px] bg-white   rounded-xl overflow-hidden">
        <div className="product-image bg-yellow-300 h-[66%] w-[100%]">
        <img className='w-full h-full object-fill' src={src} alt="" />

        </div>
        <div className="product-details ml-3">
            <h1 className='font-gilroy text-left  text-lg mt-2 text-black'>Lavish Musk Premium Attar</h1>
            <div className="rating flex gap-2  items-center">
            <img className='w-5 h-5 object-cover' src="https://cdn.iconscout.com/icon/free/png-512/free-star-icon-download-in-svg-png-gif-file-formats--favorite-award-rating-seo-pack-web-icons-2117160.png" alt="img" />
            <img className='w-5 h-5 object-cover' src="https://cdn.iconscout.com/icon/free/png-512/free-star-icon-download-in-svg-png-gif-file-formats--favorite-award-rating-seo-pack-web-icons-2117160.png" alt="img" />
            <img className='w-5 h-5 object-cover' src="https://cdn.iconscout.com/icon/free/png-512/free-star-icon-download-in-svg-png-gif-file-formats--favorite-award-rating-seo-pack-web-icons-2117160.png" alt="img" />
            <img className='w-5 h-5 object-cover' src="https://cdn.iconscout.com/icon/free/png-512/free-star-icon-download-in-svg-png-gif-file-formats--favorite-award-rating-seo-pack-web-icons-2117160.png" alt="img" />
            <img className='w-5 h-5 object-cover' src="https://cdn.iconscout.com/icon/free/png-512/free-star-icon-download-in-svg-png-gif-file-formats--favorite-award-rating-seo-pack-web-icons-2117160.png" alt="img" />
           <p className='font-gilroy text-lg text-black'>(4.9)</p>
 
            </div>
             
             <h1 className='text-xl font-bold font-Lilita text-left text-black  mt-2'>
                $ 400
             </h1>


        </div>
        <button className='bg-black text-white w-[90%] h-10 mt-3 font-Lilita rounded-xl'>
              ADD TO CART
        </button>
     </div>
    </>
  )
}

export default ProductCard