import { ChangeEvent, useEffect, useState } from "react";
import api from "../../services/apiService";
import ProductCard from "../../components/ProductCard";
import { IProduct } from "@/types/productTypes";

const AllProductsPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [sortedProducts, setSortedProducts] = useState<IProduct[]>([]);
  const [sortOption, setSortOption] = useState("az"); 
  const [gender, setGender] = useState(''); // Set initial gender to an empty string

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/api/user/products"); // Adjust the API endpoint as necessary
        const {data:products}=response.data
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on gender
  const filterProductsByGender = (gender: string) => {
    if (!gender) {
      return products; // Return all products if no gender is selected
    }
    return products.filter(product => product.Gender === gender);
  };

  // Sort products based on selected option
  const sortProducts = (option: string, filteredProducts: IProduct[]) => {
    const sorted = [...filteredProducts]; // Create a copy of the filtered products array

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
          return priceB - priceA; // Descending order
        });
        break;
      case "az":
        sorted.sort((a, b) => a.Name.localeCompare(b.Name)); // Sort by Name A-Z
        break;
      case "za":
        sorted.sort((a, b) => b.Name.localeCompare(a.Name)); // Sort by Name Z-A
        break;
      default:
        break;
    }

    return sorted;
  };

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.value;
    setSortOption(selectedOption);
  };

  const handleGender = (event: ChangeEvent<HTMLSelectElement>): void => {
    setGender(event.target.value);
  };

  useEffect(() => {
    const filteredProducts = filterProductsByGender(gender);
    const sorted = sortProducts(sortOption, filteredProducts);
    setSortedProducts(sorted);
  }, [products, sortOption, gender]);

  return (
    <div>
      <div className="heading text-center">
        <h1 className="text-4xl text-center font-Quando mt-5">
          Our Complete Collections
        </h1>
        <p className="fot">
          Discover our wide range of high-quality products, curated to meet all
          your needs.
        </p>
      </div>
      <div className="filter-sort-container mt-5 text-center flex gap-5 justify-center">
        <div>
          <p>Gender:</p>
          <select
            className="text-gray-700 w-60 h-10 px-5"
            id="Gender"
            value={gender}
            onChange={handleGender}
          >
            <option value="">Select Gender</option> {/* Added option to select gender */}
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
      </div>
      <div className="flex justify-center gap-10 px-10 pb-10 mt-5 text-center mx-auto">
        {sortedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default AllProductsPage;
