import React, { ChangeEvent, useEffect, useState } from "react";
import api from "../../services/apiService";
import ImageCropper from "../../components/ImageCropper/ImageCropper";
import { convertBlobUrlsToFiles } from "../../utils/fileUpload";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AxiosError } from "axios";

type SizeInfo = {
  price: string; // Quantity as string
  stock: string; // Stock as string
};

type Quantities = Record<string, SizeInfo>;

interface Category {
  _id: string;
  categoryName: string;
}

const AdminAddProduct = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState<Quantities>({});
  const [newSize, setNewSize] = useState<string>("");

  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedScentType, setSelectedScentType] = useState<string>("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");

  const [discountPercentage, setDiscountPercentage] = useState<number | "">("");

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [croppedImages, setCroppedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [showCropper, setShowCropper] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const imageFiles = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setSelectedImages(imageFiles);
      setCurrentImageIndex(0); // Start with the first image
      setShowCropper(true);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setCroppedImages((prevCroppedImages) => {
      const updatedCroppedImages = [...prevCroppedImages];

      if (currentImageIndex < updatedCroppedImages.length) {
        updatedCroppedImages[currentImageIndex] = croppedImage;
      } else {
        updatedCroppedImages.push(croppedImage);
      }

      return updatedCroppedImages;
    });

    const nextImageIndex = currentImageIndex + 1;

    if (nextImageIndex < selectedImages.length) {
      setCurrentImageIndex(nextImageIndex);
    } else {
      setShowCropper(false);
    }
  };

  const handleCloseCropper = () => {
    setShowCropper(false);
  };

  const handlePriceQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [name]: {
        ...prevQuantities[name],
        price: value.toString(),
      },
    }));
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [name]: {
        ...prevQuantities[name],
        stock: value.toString(),
      },
    }));
  };

  const handleAddSize = () => {
    if (newSize && !quantities[newSize]) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [newSize]: { price: "", stock: "" },
      }));
      setNewSize("");
    }
  };

  const handleGenderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedGender(e.target.value);
  };

  const handleScentTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedScentType(event.target.value);
  };

  const sendProductsToServer = async () => {
    if (!productName.trim()) {
      toast.error("Product name is required.");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required.");
      return;
    }
    for (const [key, value] of Object.entries(quantities)) {
      if (Number(value.price) < 0 || Number(value.stock) < 0) {
        toast.error(
          `Quantity and Stock for size "${key}" must be non-negative.`
        );
        return;
      }
    }

    if (!selectedGender) {
      toast.error("Gender is required.");
      return;
    }
    if (!selectedCategory) {
      toast.error("Category is required.");
      return;
    }
    if (!selectedScentType) {
      toast.error("Scent type is required.");
      return;
    }

    try {
      const blobUrls = croppedImages;
      const files = await convertBlobUrlsToFiles(blobUrls);
      if (files.length === 0) {
        toast.error("At least one image is required.");
        return;
      }

      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("Name", productName);
      formData.append("Description", description);
      formData.append("Gender", selectedGender);
      formData.append("categoryName", selectedCategory);
      formData.append("ScentType", selectedScentType);
      formData.append("DiscountPercentage", String(discountPercentage));
      Object.entries(quantities).forEach(([key, value]) => {
        formData.append(`productVolumes[${key}][price]`, value.price);
        formData.append(`productVolumes[${key}][stock]`, value.stock);
      });

      const response = await api.post("/api/admin/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/admin/products");
      }
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
    }
  };

  const getCategories = async () => {
    try {
      const res = await api.get("/api/admin/categories");
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories.");
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="w-full pb-5 text-gray-200">
      <h1 className="font-Bowly ml-10 text-4xl pt-7">Add New Product</h1>
      <div className="flex flex-wrap gap-4 ml-9 mt-5 justify-center">
        <input
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setProductName(event.target.value)
          }
          value={productName}
          placeholder="Product Name"
          type="text"
          className="w-[45%] h-12 border-2 px-3 py-3 rounded-xl text-gray-600 placeholder:text-gray-600 font-bold font-gilroy"
        />
        <textarea
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(event.target.value)
          }
          value={description}
          name="product-description"
          placeholder="Description"
          className="w-[45%] h-36 p-3 rounded-xl resize-none border-2 text-gray-600 placeholder:text-gray-600 font-bold font-gilroy"
        ></textarea>

        <div className="px-5 w-[45%] -mt-10 py-3 shadow-2xl rounded-3xl border-2">
          <h1 className="font-gilroy font-bold text-2xl mb-5">
            Product Price And Stock Configuration
          </h1>
          <div className="price-container flex flex-col gap-2 font-gilroy font-bold text-xl">
            {Object.keys(quantities).map((size) => (
              <div key={size} className="flex gap-4 items-center">
                <span>{size} :</span>
                <input
                  type="number"
                  name={size}
                  value={quantities[size].price}
                  onChange={handlePriceQuantityChange}
                  className="ml-3 w-28 border-2 text-gray-500 rounded-xl py-1 px-2"
                  placeholder="Price"
                />
                <span>Stock:</span>
                <input
                  type="number"
                  name={size}
                  value={quantities[size].stock}
                  onChange={handleStockChange}
                  className="ml-3 w-28 border-2 text-gray-500 rounded-xl py-1 px-2"
                  placeholder="Stock"
                />
              </div>
            ))}
          </div>
          <div className="add-size-container flex gap-2 mt-4">
            <input
              type="text"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="Enter new size (e.g., 20ml, 100ml)"
              className="border-2 rounded-xl py-1 px-2 text-gray-600"
            />
            <button
              onClick={handleAddSize}
              className="border-2 rounded-xl py-1 px-2"
            >
              Add Size
            </button>
          </div>
        </div>

        <div className="category w-[45%]">
          <select
            className="block w-full text-gray-600 font-gilroy font-bold px-4 py-2 pr-8 border-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mt-2"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              console.log(e.target.value);
            }}
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((category) => (
              <option key={category._id} value={category.categoryName}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="gender w-[45%]">
          <select
            value={selectedGender}
            id="gender"
            onChange={handleGenderChange}
            className="block w-full font-gilroy text-gray-600 font-bold px-4 py-2 pr-8 border-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mt-2"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <div className="flex items-center justify-around w-full ml-9">
          <div className="scentType w-[45%]">
            <select
              onChange={handleScentTypeChange}
              value={selectedScentType}
              className="w-full text-gray-600 font-gilroy font-bold px-4 py-2 pr-8 border-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mt-2"
            >
              <option value="" disabled>
                Select Scent Type
              </option>
              <option value="Woody">Woody</option>
              <option value="Fruity">Fruity</option>
              <option value="Floral">Floral</option>
              <option value="Citrus">Citrus</option>
              <option value="Spicy">Spicy</option>
            </select>
          </div>
          <input
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const value = event.target.value;
              setDiscountPercentage(value === "" ? "" : parseFloat(value));
            }}
            value={discountPercentage}
            placeholder="Discount Percentage"
            type="number"
            className="h-12 border-2 text-gray-600 px-3 py-3 rounded-xl placeholder:text-gray-600 font-bold font-gilroy"
          />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="border-2 rounded-xl py-1 px-2 text-gray-600"
          />
        </div>

        <div className="w-[45%]">
          {showCropper && selectedImages[currentImageIndex] && (
            <ImageCropper
              imageSrc={selectedImages[currentImageIndex]}
              onClose={handleCloseCropper}
              onCropComplete={handleCropComplete}
            />
          )}
        </div>

        <div className="cropped-images-preview w-full flex gap-6 items-center justify-center flex-wrap">
          {croppedImages.map((img, idx) => (
            <div key={idx} className="relative w-44">
              <img className="w-full" src={img} alt={`Cropped ${idx}`} />
              <button
                className="absolute top-0 right-0 bg-white shadow-md hover:bg-gray-200"
                onClick={() => {
                  setCurrentImageIndex(idx);
                  setShowCropper(true);
                }}
              >
                <i className="fas fa-edit text-gray-300 hover:text-black w-5"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex justify-center">
        <Button
          ButtonHandler={sendProductsToServer}
          text="Add Product"
          paddingVal={10}
        />
      </div>
    </div>
  );
};

export default AdminAddProduct;
