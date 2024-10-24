import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { IProduct } from "@/types/productTypes";
import { ICategories } from "./AdminCategoryPage";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import api from "@/services/apiService";
import { Axis3D } from "lucide-react";
import { AppHttpStatusCodes } from "@/types/statusCode";
const AdminOfferPage: React.FC = () => {
  const [offerType, setOfferType] = useState("");
  const [DiscountPercentage, setDiscountPercentage] = useState("");
  const [offerItems, setOfferItems] = useState<IProduct[] | ICategories[]>([]);
  const [selectedOfferItem, setSelectedOfferItem] = useState("");
  const navigate = useNavigate();

  // Example product and category lists (replace with actual data)

  const handleOfferSubmission = async (e: FormEvent) => {
    e.preventDefault();

    // Prepare offer data
    const offerData = {
      DiscountPercentage,
      itemId: selectedOfferItem,
    };

    // Basic validation
    if (!offerType) {
      toast.error("Offer type is required.");
      return;
    }
    if (!DiscountPercentage) {
      toast.error("Discount Percentage is required.");
      return;
    }

    if (!selectedOfferItem) {
      toast.error(
        `Please select a ${offerType === "product" ? "product" : "category"}.`
      );
      return;
    }

    try {
      
      const endpoint =
        offerType === "product"
          ? "/api/admin/product-offer"
          : "/api/admin/category-offer";
      const response = await api.patch(endpoint, offerData);
      if (response.status === AppHttpStatusCodes.OK) {
        toast.success(response.data.message);
        setOfferType("");
        setDiscountPercentage("");
        setSelectedOfferItem("");
      }
    } catch (error) {
     
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "something went Wrong");
      }
      console.error("Submission error:", error);
    }
  };

  const getAllProducts = async () => {
    try {
      const res = await api.get("/api/admin/products");
      if (res.data.success) {
        setOfferItems(res.data.products);
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

  const getCategories = async () => {
    try {
      const response = await api.get("/api/admin/categories");
      if (response.data.success) {
        setOfferItems(response.data.categories);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          navigate("/admin");
        }
      }
    }
  };

  useEffect(() => {
    if (offerType) {
      if (offerType === "product") {
        getAllProducts();
      } else {
        getCategories();
      }
    }
  }, [offerType]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white text-gray-700 shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Offer Management
        </h2>
        <form onSubmit={handleOfferSubmission}>
          <div className="mb-4">
            <label
              htmlFor="offer-type"
              className="block text-gray-700 font-semibold mb-2"
            >
              Offer Type
            </label>
            <select
              id="offer-type"
              name="offerType"
              value={offerType}
              onChange={(e) => {
                if (!e.target.value) {
                  setSelectedOfferItem("");
                }
                setOfferType(e.target.value);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-300"
            >
              <option value="">Select a Offer Type</option>
              <option value="product">Product Offer</option>
              <option value="category">Category Offer</option>
            </select>
          </div>

          {/* Product Selection (if "Product Offer" is selected) */}

          <div className="mb-4">
            <label
              htmlFor="product-selection"
              className="block text-gray-700 font-semibold mb-2"
            >
              {!offerType
                ? "Please select an offer type"
                : offerType === "product"
                ? "Select Product"
                : "Select Category"}
            </label>
            <select
              disabled={!offerType}
              id="product-selection"
              value={selectedOfferItem}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSelectedOfferItem(e.target.value)
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-300"
            >
              <option value="">
                {offerType === ""
                  ? "Please select an offer type"
                  : offerType === "product"
                  ? "Select a Product"
                  : "Select a Category"}
              </option>
              {offerItems.map((item) => (
                <option key={item._id} value={item._id}>
                  {offerType === "product"
                    ? (item as IProduct).Name
                    : (item as ICategories).categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="discount-percentage"
              className="block text-gray-700 font-semibold mb-2"
            >
              Discount Percentage (%)
            </label>
            <input
              type="number"
              id="discount-percentage"
              name="DiscountPercentage"
              placeholder="Enter Discount"
              value={DiscountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-300"
              min="0"
              max="100"
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
            >
              Submit Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminOfferPage;
