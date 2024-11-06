import { ChangeEvent, useEffect, useState } from "react";
import api from "../../services/apiService";
import ProductCard from "../../components/ProductCard";
import { IProduct } from "@/types/productTypes";
import Pagination from "@/components/Pagination";
import { AlertTriangle } from "lucide-react";
import { AxiosError } from "axios";
import { AppHttpStatusCodes } from "@/types/statusCode";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

const AllProductsPage = () => {
 
  const [products, setProducts] = useState<IProduct[]>([]);
  const [sortedProducts, setSortedProducts] = useState<IProduct[]>([]);
  const [sortOption, setSortOption] = useState("az");
  const [gender, setGender] = useState("");
  const [displayedProducts, setDisplayedProducts] = useState<IProduct[]>([]);
  const [filterActive, setFilterActive] = useState(false);
  const location=useLocation()
  // const searchedProducts=location.state.products
  
  
  useEffect(() => {
    // console.log('searchedProduct',location.state?.products)
    const fetchProducts = async () => {
      try {
        const response = await api.get("/api/user/products");
        const { data: products } = response.data;
        setProducts(products);
        setSortedProducts(products);
        setDisplayedProducts(products); // Initialize displayedProducts
      } catch (error) {
       if(error instanceof AxiosError){
             toast.error(error.response?.data.message)
       }
      }
    };

    fetchProducts();
  }, []);

  const filterProductsByGender = (gender: string) => {
    if (!gender) return products;
    return products.filter((product) => product.Gender === gender);
  };

  const sortProducts = (option: string, filteredProducts: IProduct[]) => {
    const sorted = [...filteredProducts];

    switch (option) {
      case "priceLowHigh":
        sorted.sort((a, b) => {
          const priceA = a.Variants[0] ? a.Variants[0].price : Infinity;
          const priceB = b.Variants[0] ? b.Variants[0].price : Infinity;
          return priceA - priceB;
        });
        break;
      case "priceHighLow":
        sorted.sort((a, b) => {
          const priceA = a.Variants[0] ? a.Variants[0].price : -Infinity;
          const priceB = b.Variants[0] ? b.Variants[0].price : -Infinity;
          return priceB - priceA;
        });
        break;
      case "az":
        sorted.sort((a, b) => a.Name.localeCompare(b.Name));
        break;
      case "za":
        sorted.sort((a, b) => b.Name.localeCompare(a.Name));
        break;
      default:
        break;
    }

    return sorted;
  };

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
    setFilterActive(true);
  };

  const handleGender = (event: ChangeEvent<HTMLSelectElement>) => {
    setGender(event.target.value);
    setFilterActive(true);
  };

  const handlePagination = (products: IProduct[]) => {
    setDisplayedProducts(products);
  };

  const handleUnfilter = () => {
    setSortOption("az");
    setGender("");
    setFilterActive(false);
  };

  useEffect(() => {
    if(!gender&& sortOption==='az') setFilterActive(false)
    const filteredProducts = filterProductsByGender(gender);
    const sorted = sortProducts(sortOption, filteredProducts);
    setSortedProducts(sorted);
    // if(searchedProducts){
    //   setSortedProducts(searchedProducts)
    // }
  }, [products, sortOption, gender]);

  return (
    <div className="pb-2">
      <div className="heading text-center">
        <h1 className="text-4xl text-center font-Quando mt-5">
          Our Complete Collections
        </h1>
        <p className="fot">
          Discover our wide range of high-quality products, curated to meet all
          your needs.
        </p>
      </div>
      <div className="filter-sort-container mt-5 text-center flex gap-5 justify-center items-center">
        <div>
          <p>Gender:</p>
          <select
            className="text-gray-700 w-60 h-10 px-5"
            id="Gender"
            value={gender}
            onChange={handleGender}
          >
            <option value="">Select Gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>
        <div>
          <p>Sort By:</p>
          <select
            className="text-gray-700 w-60 h-10 px-5"
            id="sortOptions"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="az">Aa - Zz</option>
            <option value="za">Zz - Aa</option>
            <option value="priceLowHigh">Price Low - High</option>
            <option value="priceHighLow">Price High - Low</option>
          </select>
        </div>
        {filterActive && (
          <div className="unfilter-btn">
            <button
              onClick={handleUnfilter}
              className="bg-green-800 px-5 py-2 mt-4 rounded-xl text-white"
            >
              Unfilter
            </button>
          </div>
        )}
      </div>
      <div className="flex justify-center gap-10 px-10 pb-10 mt-5 text-center mx-auto">
        {displayedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {sortedProducts.length === 0 && (
       <div className="flex flex-col items-center justify-center mt-10 py-5 px-10 rounded-lg shadow-md mr-16">
       <AlertTriangle className="h-16 w-16 text-red-400 mb-3" aria-hidden="true" />
       <h2 className="text-center text-xl font-semibold text-gray-600">No Products Found</h2>
       <p className="text-center text-gray-500 mt-2">Please try adjusting your filters or search.</p>
     </div>
      )}
      <Pagination
        items={sortedProducts}
        itemsPerPage={6}
        onPageChange={handlePagination}
      />
    </div>
  );
};

export default AllProductsPage;



