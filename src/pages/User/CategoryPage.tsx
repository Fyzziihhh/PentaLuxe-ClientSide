import  { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../services/apiService'
import ProductCard from '../../components/ProductCard';
import { IProduct } from '@/types/productTypes';
import { AppHttpStatusCodes } from '@/types/statusCode';
import Pagination from '@/components/Pagination';

  
const CategoryPage = () => {

    const [products,setProducts]=useState<IProduct[]>([])
    const [displayProducts,setDisplayProducts]=useState<IProduct[]>([])
  const {id}=useParams()
  
const getAllProudctByCategory=async()=>{
    try {

        const res=await api.get(`/api/user/categories/${id}`)
     
        if(res.status===AppHttpStatusCodes.OK){
          const {data:products}=res.data
            setProducts(products)
        }
    } catch (error) {
        
    }


}

const handlePagination=(paginatedProducts:IProduct[])=>{
     setDisplayProducts(paginatedProducts)  
}

useEffect(()=>{
  getAllProudctByCategory();
},[])
  return (
    <div >
    <div className="heading text-center">
      <h1 className='text-4xl  text-center font-Quando mt-5'>Category Page</h1>
      <p className=''>Explore our exquisite collection of Attars, known for their rich, long-lasting fragrances crafted from natural ingredients.</p>
    </div>
    
   
  <div className='flex justify-center gap-10 px-10 mb-10 mt-5 text-center mx-auto'>

      {(displayProducts.length>0?displayProducts:products).map((product) => (
         <ProductCard key={product._id} product={product}/>
      ))}
  </div>

  <Pagination items={products} itemsPerPage={1} onPageChange={handlePagination}/>


  </div>
  )
}

export default CategoryPage