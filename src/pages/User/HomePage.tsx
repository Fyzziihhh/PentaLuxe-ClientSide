import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import api from "../../services/apiService";
import { AxiosError } from "axios";
import { userProductListing } from "../../utils/endpoints";
import { toast } from "sonner";
interface Categories {
  _id: string;
  categoryName: string;
  categoryImage: string;
}

interface IProduct {
  _id: string;
  productName: string;
  productImages: string[];
  productDescription: string;
  productStockQuantity: number;
  gender?: "Men" | "Women" | "Unisex";
  productScentType: string;
  productDiscountPrice: number;
  productVolumes?: { [key: string]: string };
  isBlocked?: boolean;
}

const HomePage = () => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);

  const getCategories = async () => {
    try {
      const response = await api.get("/api/user/categories");
      if (response.data.success) {
        setCategories(response.data.categories);
        console.log(categories);
      }
    } catch (error) {
      if (error instanceof AxiosError) toast.error(error.response?.data.message|| 'something went wrong');
    }
  };
  const getProducts = async () => {
    try {
      const response = await api.get(userProductListing);
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      if (error instanceof AxiosError) toast.error(error.response?.data.message);
    }
  };

  useEffect(() => {
    getCategories();
    getProducts();
  }, []);

  return (
    <>
      <div className="w-full h-screen ">
        <img className="w-full" src="/assets/banner-dior-xmas.jpg" alt="" />
      </div>
      <div className="mx-auto w-[450px] text-center -mt-10 mb-5">
        <p className="mx-auto w-[100%] font-gilroy text-xl">
          At PentaLuxe, we meticulously craft each fragrance to not only enhance
          your presence but also to create moments that linger in memory.
        </p>
        <Link to="/products">
          <Button
            text="Discover All"
            // ButtonHandler={goToAllProductsPage}
            paddingVal={3}
          />
        </Link>
      </div>
      <div className="category-container">
        <h1 className="font-Quando text-4xl text-center mb-2 mt-8">
          Shop By Category
        </h1>
        <p className="font-gilroy text-center mb-5">
          Explore our premium range of products
        </p>
        <div className="card-container flex gap-10 justify-center flex-wrap">
          {categories.map((category) => (
            <Link to={`/categories/${category._id}`} className="w-1/4 h-96">
              <div
                className={
                  category.categoryName === "Body Perfumes"
                    ? "category-card w-full h-full bg-pink-200 rounded-xl bg-center bg-contain flex items-end justify-center text-2xl font-gilroy text-slate-100"
                    : "category-card w-full h-full bg-pink-200 rounded-xl bg-center bg-cover flex items-end justify-center text-2xl font-gilroy text-slate-100"
                }
                style={{ backgroundImage: `url(${category.categoryImage})` }}
              >
                {category.categoryName}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="New-arraivals-container text-center  mt-10">
        <h1 className="font-Quando text-4xl mb-2">New Arraivals</h1>
        <p className="font-gilroy ">Find Your New Favorite Fragrance!</p>
        <div className="New-arraivals-card-container flex justify-center gap-5 px-10 mb-10 mt-5 flex-wrap">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
      <div className="product-category w-full -mt-3 mb-6 px-10 ">
        <img src="/assets/bg.png" alt="" />
      </div>

      <div className="services w-full h-[300px] mb-5">
        <h1 className="font-Quando text-center text-4xl">Why Trust Us</h1>
        <div className="services-container w-full flex justify-center items-center gap-5 mt-10">
          <div className="service-card w-[170px] h-40 bg-slate-200 rounded-xl flex flex-col justify-center items-center pt-2">
            <img
              className=" h-32"
              src="/assets/CompanyPolicy/Medal.png"
              alt=""
            />
            <p className="text-black font-gilroy">Premium Quality</p>
          </div>
          <div className="service-card w-[170px] h-40 bg-slate-200 rounded-xl flex flex-col justify-center items-center pt-2">
            <img
              className="ml-10"
              src="/assets/CompanyPolicy/no-gmo_1.png"
              alt=""
            />
            <p className="text-black font-gilroy mt-4">Derma Tested</p>
          </div>
          <div className="service-card w-[170px] h-40 bg-slate-200 rounded-xl flex flex-col justify-center items-center pt-2">
            <img src="/assets/CompanyPolicy/molecular.png" alt="" />
            <p className="text-black font-gilroy mt-5"> Long Lasting</p>
          </div>
          <div className="service-card w-[170px] h-40 bg-slate-200 rounded-xl flex flex-col justify-center items-center pt-2">
            <img src="/assets/CompanyPolicy/iso-symbol.png" alt="" />
            <p className="text-black font-gilroy mt-4">Variety Of Fragrance</p>
          </div>
          <div className="service-card w-[170px] h-40 bg-slate-200 rounded-xl flex flex-col justify-center items-center pt-2">
            <img
              className="mb-3"
              src="/assets/CompanyPolicy/cruelty-free_4.png"
              alt=""
            />
            <p className="text-black font-gilroy mb-3">100% Vegan</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
