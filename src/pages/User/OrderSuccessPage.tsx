import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const OrderSuccessPage = () => {
  const location=  useLocation()
  return (
    <div className='bg-secondary w-[30%] h-96 mx-auto text-center rounded-md flex flex-col gap-2 font-montserrat my-5 font-bold'>
      <img className='mx-auto ' width={150} height={150} src="https://cdnl.iconscout.com/lottie/premium/thumb/checkout-done-animated-icon-download-in-lottie-json-gif-static-svg-file-formats--add-to-cart-bag-shopping-items-pack-e-commerce-icons-4831454.gif" alt="Shopping Cart Icon" />
  
   <h1 className='font-Bowly text-2xl'>Thank you for your Order</h1>
   <h1 className='font-bold'>Your Order has been Successfully Placed</h1>

   <h1 className='mt-4'>Order Number : <span className='font-bold'>{location.state?.orderId ||' 666'}</span></h1>
   <h1>Estimated Delivery : {new Date(location.state.DeliveryDate).toLocaleDateString('en-US')|| "3-5 bussiness days"}</h1>
   <div className="buttons flex gap-3 justify-center mt-5">
    <Link to='/profile/orders' className='bg-slate-700  p-2 rounded-md font-bold px-10 hover:bg-slate-800'>My Order</Link>
    <Link to='/products' className='bg-slate-700 p-2 rounded-md font-bold hover:bg-slate-800'>Continue Shopping</Link>
   </div>
    </div>
  

  )
}

export default OrderSuccessPage