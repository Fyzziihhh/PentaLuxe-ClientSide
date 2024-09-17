import { useEffect, useState } from "react";
import api from "../../services/apiService";
import { adminProductListing} from "../../utils/endpoints";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DeleteModal from "../../components/DeleteModal/DeleteModal";

interface IProduct {
  _id: string;
  CategoryId:{
    categoryName:string;
  }
  productName: string; // Reference to Category
  productImages: string[]; // Array of product image URLs
  productDescription: string;
  productStockQuantity: number;
  gender?: "Men" | "Women" | "Unisex"; // Optional since enum is provided
  productScentType: string;
  productDiscountPrice: number;
  productVolumes?: { [key: string]: string }; // Optional since it's not marked as required
  isBlocked?: boolean; // Optional with a default value
}

interface IProductToDelete{
  id:string;
  name:string;
}

const AdminProductsPage = () => {
  const[isModalOpen,setModalIsOpen]=useState(false)
  const [refresh,setRefresh]=useState(false)
  const [productToDelete,setProductToDelete]=useState<IProductToDelete|null>(null)
  const navigate=useNavigate();
  const [products, setProducts] = useState<IProduct[]>([]);
  const getProducts = async () => {
    try {
      const res = await api.get(adminProductListing);

      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      if(error instanceof AxiosError){
        if(error.response?.status===403){
          navigate('/admin')
        }
        toast.error(error.response?.data.message)
      }
    }
  };
  
  const openModal=(id:string,name:string)=>{
      setModalIsOpen(true)
      setProductToDelete({
        id,
        name
      })
  }

  const onProductDelete=async(id:string)=>{
      try {
        const res=await api.delete(`/api/admin/products/${id}`)
      if(res.data.success){
        setRefresh(prev=>!prev)
        toast.success(res.data.message)
      }
      } catch (error) {
        if(error instanceof AxiosError){
          toast.error(error.response?.data.message)
        }
      } 
  }
  





  useEffect(() => {
    getProducts();
  }, [refresh]);



return (
  <div className="container mx-auto p-6">
    <DeleteModal
    isOpen={isModalOpen}
    onRequestClose={()=>setModalIsOpen(false)}
    item={productToDelete}
    onDelete={onProductDelete}
    />
    <h1 className="font-Bowly text-4xl underline mb-5">Admin Product Management</h1>

<div className="flex justify-between items-cent3r mb-5 px-10">
  <Link to='/admin/products/add'>
  <button className="bg-white rounded-lg py-2 px-7 text-gray-700 font-Bowly flex justify-center gap-2 items-center ">
<img className="w-10 h-10" src="https://cdn.iconscout.com/icon/premium/png-512-thumb/add-9307284-7587180.png?f=webp&w=512" alt="" />
     <span>Add Product</span>
     </button>
  </Link>

     <input placeholder="search for product" type="text" className="text-black text-lg font-Lilita rounded-lg py-4 px-5 w-[300px]"/>
</div>

    <div className="overflow-x-auto">
      <table className="min-w-full bg-transparent border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-100 text-left text-sm text-gray-600">
            <th className="px-6 py-3">Product Image</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Category</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Stock</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Description</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index} className="border- border-gray-200">
              <td className="px-6 py-4">
                <img src={product.productImages[0]} alt={product.productName} className="w-[200px] h-[70px] object-cover rounded" />
              </td>
              <td className="px-6 py-4">{product.productName}</td>
              <td className="px-6 py-4">{product.CategoryId.categoryName}</td>
              <td className="px-6 py-4">{product.productVolumes?.['20ml']}</td>
              <td className="px-6 py-4">{product.productStockQuantity}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    !product.isBlocked ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}
                >
                  {product.isBlocked?"BLOCKED":'ACTIVE'}
                </span>
              </td>
              <td className="px-6 py-4">{product.productDescription}</td>
              <td className="px-6 py-4 flex space-x-2">
              <Link to={`/admin/products/${product._id}`}>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
              </Link>
                <button onClick={()=>openModal(product._id,product.productName)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
};


export default AdminProductsPage;
