import React, { ChangeEvent, useEffect, useState } from "react";
import api from "../../services/apiService";
import ImageCropper from "../../components/ImageCropper/ImageCropper";
import { convertBlobUrlsToFiles } from "../../utils/fileUpload";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { PulseLoader } from "react-spinners";

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
  const [loading,setLoading]=useState(false)
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
  setLoading(true)

      const response = await api.post("/api/admin/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setLoading(false)
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
    <div className="container mx-auto p-5 text-black">
    <h1 className="text-3xl font-bold mb-5">Add New Product</h1>
  
    <div className="grid grid-cols-2 gap-4">
      {/* Product Name */}
      <div className="col-span-1">
        <label className="block mb-2 text-sm font-bold">Product Name</label>
        <input
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setProductName(event.target.value)
          }
          value={productName}
          placeholder="Product Name"
          type="text"
          className="w-full p-3 pl-10 outline-none rounded-md text-sm text-gray-700 border-2 transition focus:ring focus:ring-blue-500"
        />
      </div>
  
      {/* Description */}
      <div className="col-span-1">
        <label className="block mb-2 text-sm font-bold">Description</label>
        <textarea
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(event.target.value)
          }
          value={description}
          name="product-description"
          placeholder="Description"
          className="w-full h-36 p-3 pl-10 text-sm text-gray-700 resize-none border-gray-400 border"
        ></textarea>
      </div>
  
      {/* Product Price And Stock Configuration */}
      <div className="col-span-2">
        <h2 className="text-2xl font-bold mb-5">
          Product Price And Stock Configuration
        </h2>
        <div className="price-container flex flex-col gap-2 font-gilroy font-bold text-xl ">
          {Object.keys(quantities).map((size) => (
            <div key={size} className="flex gap-2 items-center">
              <span>{size} :</span>
              <input
                type="number"
                name={size}
                value={quantities[size].price}
                onChange={handlePriceQuantityChange}
                className="ml-3 w-1/3 p-3  text-sm text-gray-700 border-2 outline-none transition rounded-md focus:ring ring-blue-600"
                placeholder="Price"
              />
           
              <input
                type="number"
                name={size}
                value={quantities[size].stock}
                onChange={handleStockChange}
                className="ml-3 w-1/3 p-3 pl-10 text-sm border-2 text-gray-700  outline-none transition rounded-md focus:ring ring-blue-600"
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
            className="w-1/2 p-3 outline-none rounded-md transition pl-10 text-sm text-gray-700 border-2 focus:ring focus:ring-blue-500"
          />
          <button
            onClick={handleAddSize}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Size
          </button>
        </div>
      </div>
  
      {/* Category */}
      <div className="col-span-1 ">
        <label className="block mb-2 text-sm font-bold">Category</label>
        <select
          className="w-full p-3 pl-10 text-sm text-gray-700 border border-gray-400"
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
  
      {/* Gender */}
      <div className="col-span-1">
        <label className="block mb-2 text-sm font-bold">Gender</label>
        <select
          value={selectedGender}
          id="gender"
          onChange={handleGenderChange}
          className="w-full p-3 pl-10 text-sm text-gray-700 border border-gray-400"
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Unisex">Unisex</option>
        </select>
      </div>
  
      {/* Scent Type and Discount */}
      <div className="col-span-2 flex gap-4">
        {/* Scent Type */}
        <div className="w-1/2">
          <label className="block mb-2 text-sm font-bold">Scent Type</label>
          <select
            onChange={handleScentTypeChange}
            value={selectedScentType}
            className="w-full p-3 pl-10 text-sm text-gray-700 border border-gray-400"
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

      {/* Discount Percentage */}
      <div className="w-1/2">
        <label className="block mb-2 text-sm font-bold">Discount Percentage</label>
        <input
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setDiscountPercentage(value === "" ? "" : parseFloat(value));
          }}
          value={discountPercentage}
          placeholder="Discount Percentage"
          type="number"
          className="w-full p-3 pl-10 text-sm text-gray-700 border border-gray-400"
        />
      </div>
    </div>

    {/* Image Upload */}
    <div className="col-span-2">
      <label className="block mb-2 text-sm font-bold">Image Upload</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="w-full p-3 pl-10 text-sm text-gray-700"
      />
    </div>

    {/* Image Cropper */}
    {showCropper && selectedImages[currentImageIndex] && (
      <div className="col-span-2">
        <ImageCropper
          imageSrc={selectedImages[currentImageIndex]}
          onClose={handleCloseCropper}
          onCropComplete={handleCropComplete}
        />
      </div>
    )}

    {/* Cropped Images Preview */}
    <div className="col-span-2">
      <h2 className="text-2xl font-bold mb-5">{croppedImages.length>0&&"Cropped Images"}</h2>
      <div className="flex gap-6 flex-wrap">
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

    {/* Submit Button */}
    <div className="w-full flex justify-center mt-5">
      <Button
        ButtonHandler={sendProductsToServer}
        text={loading?<PulseLoader color="#ffff" />:"Add Product"}
        paddingVal={10}
      />
    </div>
  </div>
</div>
  );
};

export default AdminAddProduct;
