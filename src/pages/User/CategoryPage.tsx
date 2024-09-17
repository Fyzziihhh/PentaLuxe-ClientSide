import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../services/apiService'
import ProductCard from '../../components/ProductCard/ProductCard';
interface IProduct {
    _id:string;
    // CategoryId:{
    //     categoryName:string;
    // }
    productName: string; 
    productImages: string[];     // Array of product image URLs
    productDescription: string;
    productStockQuantity: number;
    gender?: 'Men' | 'Women' | 'Unisex';  // Optional since enum is provided
    productScentType: string;
    productDiscountPrice: number;
    productVolumes?: {[key:string]:string};  // Optional since it's not marked as required
    isBlocked?: boolean;  // Optional with a default value
  }
  
const CategoryPage = () => {
    const [products,setProducts]=useState<IProduct[]>([])
  const {id}=useParams()
  
const getAllProudctByCategory=async()=>{
    try {

        const res=await api.get(`/api/user/categories/${id}`)
        if(res.data.success){
            setProducts(res.data.products)
        }
    } catch (error) {
        
    }


}

useEffect(()=>{
  getAllProudctByCategory();
},[])
  return (
    <div>
    <div className="heading text-center">
      <h1 className='text-4xl  text-center font-Quando mt-5'>Category Page</h1>
      <p className=''>Explore our exquisite collection of Attars, known for their rich, long-lasting fragrances crafted from natural ingredients.</p>
    </div>
    
   
  <div className='flex justify-center gap-10 px-10 mb-10 mt-5 text-center mx-auto'>

      {products.map((product) => (
         <ProductCard key={product._id} product={product}/>
      ))}
  </div>


  </div>
  )
}

export default CategoryPage