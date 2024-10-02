import  { useEffect, useState } from 'react';

import api from '../../services/apiService';
import ProductCard from '../../components/ProductCard';

interface IProduct {
  _id:string;
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

const AllProductsPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/user/products');
      setProducts(res.data.products);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
   getProducts()
  },[])
  return (
    <div>
      <div className="heading text-center">
        <h1 className='text-4xl  text-center font-Quando mt-5'>Our Complete Collections</h1>
        <p className='fot'>Discover our wide range of high-quality products, curated to meet all your needs.</p>
      </div>
      
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    <div className='flex justify-center gap-10 px-10 mb-10 mt-5 text-center mx-auto'>

        {products.map((product) => (
           <ProductCard key={product._id} product={product}/>
        ))}
    </div>
  

    </div>
  );
};

export default AllProductsPage;
