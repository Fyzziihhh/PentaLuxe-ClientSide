import { useEffect, useState } from "react";
import api from "../../services/apiService";
import ProductCard from "../../components/ProductCard";
import { IProduct } from "@/types/productTypes";
import Pagination from "@/components/Pagination";
import { AlertTriangle } from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "sonner";

const AllProductsPage = () => {
const [searchedProducts,setSearchedProducts]=useState<IProduct[]>([])
  // const searchedProducts = useSelector(
  //   (state:{search:{searchedProducts:IProduct[]}}) => state.search?.searchedProducts || []
  // );

  const [products, setProducts] = useState<IProduct[]>([]);
  const [sortedProducts, setSortedProducts] = useState<IProduct[]>([]);
  const [sortOption, setSortOption] = useState("az");
  const [gender, setGender] = useState("");
  const [displayedProducts, setDisplayedProducts] = useState<IProduct[]>([]);
  const [filterActive, setFilterActive] = useState(false);
  const [input,setInput]=useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/api/user/products");
        const { data: products } = response.data;
        setProducts(products);
  
        if (!searchedProducts || searchedProducts.length === 0) {
          setSortedProducts(products);
          setDisplayedProducts(products);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);
        }
      }
    };
  
    // Only fetch products if there are no searchedProducts
    if (searchedProducts.length > 0) {
      setSortedProducts(searchedProducts);
      setDisplayedProducts(searchedProducts);
    } else if (products.length === 0) {
      fetchProducts();
    }
  }, [searchedProducts]);
  

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

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
    setFilterActive(true);
  };

  const handleGender = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
    const filteredProducts = filterProductsByGender(gender);
    const sorted = sortProducts(sortOption, filteredProducts);
    setSortedProducts(sorted);
    setDisplayedProducts(sorted);
  }, [products, sortOption, gender]);
  


  const onSearchHandler = async () => {
   
    try {
      if (input.trim().length > 0) {
        const res = await api.post("/api/user/search-products-by-category", {
          text: input,
        });
        if (res.status === 200) {
          console.log(res.data)
          setSearchedProducts(res.data.searchedProducts)
          setInput("");
      
        }
      }
    } catch (error) {
      if(error instanceof  AxiosError){
        toast.error(error.response?.data.message)
      }
    }
  };

  const clearSearchedProducts = () => {
    setInput(""); 
    setSearchedProducts([]); 
    setGender(""); 
    setSortOption("az"); 
    setFilterActive(false); 
    const sorted = sortProducts("az", products);
    setSortedProducts(sorted);
    setDisplayedProducts(sorted); 
  };
  
  

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
       
       <div className="relative w-[20%] max-w-md mt-5">  
      <input
      value={input}
       onChange={(e)=>{
        console.log(e.target.value)
        setInput(e.target.value)}}
        type="search"
        placeholder="Search Products..."
        className="block w-full px-12 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
      />
      <svg onClick={onSearchHandler}
        className="absolute w-5 h-5 text-gray-400 top-1/2 left-4 transform -translate-y-1/2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l6 6m2-6a8 8 0 11-16 0 8 8 0 0116 0z"
        />
      </svg>
    </div>
    <button onClick={clearSearchedProducts} className="bg-red-900 p-2 rounded-lg mt-5">clear </button>

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
        itemsPerPage={3}
        onPageChange={handlePagination}
      />
    </div>
  );
};

export default AllProductsPage;



