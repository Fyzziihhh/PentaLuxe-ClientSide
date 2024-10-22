import { ChangeEvent, useEffect, useState } from "react";
import api from "../../services/apiService";
import { adminProductListing } from "../../utils/endpoints";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DeleteModal from "../../components/DeleteModal";
import { IProduct } from "@/types/productTypes";
import { AppHttpStatusCodes } from "@/types/statusCode";
import Pagination from "@/components/Pagination";

const AdminProductsPage = () => {
  const [isModalOpen, setModalIsOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [itemId, setItemId] = useState("");
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<IProduct[]>([]);
  const [searchedProducts, setSearchedProducts] = useState<IProduct[]>([]);
  const [input, setInput] = useState("");

  const itemsPerPage = 3; // Set items per page for pagination

  const getProducts = async () => {
    try {
      const res = await api.get(adminProductListing);
      if (res.data.success) {
        setProducts(res.data.products);
        setDisplayedProducts(res.data.products.slice(0, itemsPerPage)); // Initial page display
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          navigate("/admin");
        }
        toast.error(error.response?.data.message);
      }
    }
  };

  const openModal = (id: string) => {
    setModalIsOpen(true);
    setItemId(id);
  };

  const onProductDelete = async (id: string) => {
    try {
      const res = await api.delete(`/api/admin/products/${id}`);
      if (res.data.success) {
        setProducts(products.filter((product) => product._id.toString() !== id));
        toast.success(res.data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    // Show all products if input is empty
    if (value.length === 0) {
      setSearchedProducts(products);
      setDisplayedProducts(products.slice(0, itemsPerPage)); // Reset pagination display
    }
  };

  const onSearchProducts = async () => {
    if (input.length === 0) {
      setSearchedProducts(products);
      return;
    }
    try {
      const res = await api.post('/api/admin/search-product', { text: input });
      if (res.status === AppHttpStatusCodes.OK) {
        setSearchedProducts(res.data.products);
        setDisplayedProducts(res.data.products.slice(0, itemsPerPage)); // Reset displayed products based on search
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };

  // Function to handle pagination
  const handlePagination = (currentPageData: IProduct[]) => {
    setDisplayedProducts(currentPageData);
  };

  useEffect(() => {
    getProducts();
  }, [refresh]);

  return (
    <div className="container mx-auto p-6 bg-gray-50 h-full">
      <DeleteModal
        isOpen={isModalOpen}
        onRequestClose={() => setModalIsOpen(false)}
        item={itemId}
        onDelete={onProductDelete}
        text="Are you sure you want to delete this product? This action cannot be undone"
      />
      <h1 className="text-4xl font-bold text-gray-800 mb-8 border-b pb-4">
        Admin Product Management
      </h1>

      <div className="flex justify-between items-center mb-8">
        <Link to="/admin/products/add">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Add Product</span>
          </button>
        </Link>
        <div className="flex gap-3">
          <input
            placeholder="Search for product"
            type="text"
            value={input}
            onChange={handleInputChange}
            className="w-64 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out text-gray-500 font-bold"
          />
          <button
            onClick={onSearchProducts}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Search
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedProducts.map((product, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={product.Images[0]}
                    alt={product.Name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.Name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.CategoryId?.categoryName || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.Variants[0]?.price || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.Variants[0]?.stock || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      !product.isBlocked
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.isBlocked ? "BLOCKED" : "ACTIVE"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="max-w-xs overflow-hidden">
                    <p className="truncate" title={product.Description}>
                      {product.Description}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/products/edit/${product._id}`)
                    }
                    className="text-indigo-600 hover:text-indigo-900 font-bold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openModal(product._id)}
                    className="text-red-600 hover:text-red-900 font-bold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <Pagination
          items={searchedProducts.length > 0 ? searchedProducts : products}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePagination}
        />
      </div>
    </div>
  );
};

export default AdminProductsPage;
