import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { PulseLoader } from "react-spinners";
import api from "../../services/apiService";
import ImageCropper from "../../components/ImageCropper/ImageCropper";
import { convertBlobUrlsToFiles } from "../../utils/fileUpload";
import Button from "../../components/Button/Button";

interface Category {
  _id: string;
  categoryName: string;
}

interface ProductVariant {
  size: string;
  price: string;
  stock: string;
}

import { IProduct } from "@/types/productTypes";
import { Trash2, Volume } from "lucide-react";

interface SizeInfo {
  price: string;
  stock: string;
}

interface IQuantities{
  volume:string;
  price:string|number;
  stock:string|number
  _id?:string;
}


const AdminEditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [quantities, setQuantities] = useState<IQuantities[]>([]);
  const [newSize, setNewSize] = useState<string>("");

  // Product details state
  const [productName, setProductName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string|undefined>('')
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedScentType, setSelectedScentType] = useState<IProduct["ScentType"] | "">("");
  const [discountPercentage, setDiscountPercentage] = useState<number | "">("");

  // Image handling state
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [croppedImages, setCroppedImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [showCropper, setShowCropper] = useState<boolean>(false);

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([getCategories(), getProductDetails()]);
    };
    initializeData();
  }, []);

  const getProductDetails = async (): Promise<void> => {
 
    try {
      if(id){

        const response = await api.get(`/api/admin/products/${id}`);
        
        if (response.data.success) {
          const product: IProduct = response.data.product;
          
          // Set basic product details
          setProductName(product.Name);
          setDescription(product.Description);
          setSelectedGender(product.Gender);
          setSelectedCategory(product.CategoryId.categoryName);
          setSelectedScentType(product.ScentType);
          setDiscountPercentage(product.DiscountPercentage);
          setExistingImages(product.Images);
  
          // Set variants/quantities
        setQuantities(product.Variants)
      
          
         
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };

  const getCategories = async (): Promise<void> => {
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files) {
      const imageFiles = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setSelectedImages(imageFiles);
      setCurrentImageIndex(0);
      setShowCropper(true);
    }
  };

  const handleCropComplete = (croppedImage: string): void => {
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

  const handlePrice = (volume: string, newPrice: number) => {
    setQuantities(prevQuantities =>
      prevQuantities.map(quantity =>
        quantity.volume === volume ? { ...quantity, price: newPrice } : quantity
      )
    );
  };
  
  const handleStockChange = (volume: string, newStock: number) => {
    setQuantities(prevQuantities =>
      prevQuantities.map(quantity =>
        quantity.volume === volume ? { ...quantity, stock: newStock } : quantity
      )
    );
  };
  

  const handleAddSize = (): void => {
    alert("entered");
    const existQuantitySize = quantities.filter(quantity => quantity.volume === newSize);
    console.log("existing", existQuantitySize);
  
    if (newSize && existQuantitySize.length === 0) {
      setQuantities(prev => [
        ...prev,
        {
          volume: newSize,
          price: '',                   
          stock: ''                     
        }
      ]);
      console.log("quantities after update", [...quantities, { _id: Date.now().toString(), volume: newSize, price: 0, stock: 0 }]);
      setNewSize("");
    }
  };
  

  const handleRemoveExistingImage = (index: number): void => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    if (!productName.trim()) {
      toast.error("Product name is required.");
      return false;
    }
    if (!description.trim()) {
      toast.error("Description is required.");
      return false;
    }
    if (!selectedGender) {
      toast.error("Gender is required.");
      return false;
    }
    if (!selectedCategory) {
      toast.error("Category is required.");
      return false;
    }
    if (!selectedScentType) {
      toast.error("Scent type is required.");
      return false;
    }
    return true;
  };

  const handleRemoveQuantity=(quantityId:string)=>{
    const updatedQuantities=quantities.filter(quantity=>quantity._id!==quantityId)
    setQuantities(updatedQuantities)
    
  }

  const updateProduct = async (): Promise<void> => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const formData = new FormData();

      if (croppedImages.length > 0) {
        const files = await convertBlobUrlsToFiles(croppedImages);
        files.forEach((file) => {
          formData.append("files", file);
        });
      }

      formData.append("existingImages", JSON.stringify(existingImages));
      formData.append("Name", productName);
      formData.append("Description", description);
      formData.append("Gender", selectedGender!);
      formData.append("categoryName", selectedCategory);
      formData.append("ScentType", selectedScentType);
      formData.append("DiscountPercentage", String(discountPercentage));
      formData.append("Quantities",JSON.stringify(quantities))
      
     

      const response = await api.put(`/api/admin/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        toast.success("Product updated successfully");
        navigate("/admin/products");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-5 text-black">

      <h1 className="text-3xl font-bold mb-5">Edit Product</h1>

      <div className="grid grid-cols-2 gap-4">
        {/* Product Name */}
        <div className="col-span-1">
          <label className="block mb-2 text-sm font-bold">Product Name</label>
          <input
            value={productName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setProductName(e.target.value)}
            placeholder="Product Name"
            type="text"
            className="w-full p-3 pl-10 text-sm text-gray-700 border border-gray-500"
          />
        </div>

        {/* Description */}
        <div className="col-span-1">
          <label className="block mb-2 text-sm font-bold">Description</label>
          <textarea
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full h-36 p-3 pl-10 text-sm text-gray-700 resize-none border-gray-400 border"
          />
        </div>

        {/* Product Price And Stock Configuration */}
        <div className="col-span-2">
          <h2 className="text-2xl font-bold mb-5">Product Price And Stock Configuration</h2>
          <div className="price-container flex flex-col gap-2 font-gilroy font-bold text-xl">
  {quantities.map(quantity => (
    <div key={quantity._id} className="flex gap-2 items-center">
      <span>{quantity.volume} :</span>
      <input
        type="number"
        name={quantity.volume}
        value={quantity.price}
        onChange={(e) => handlePrice(quantity.volume!, parseFloat(e.target.value))}
        className="ml-3 w-1/3 p-3 text-sm text-gray-700 border-2 outline-none transition rounded-md focus:ring ring-blue-600"
        placeholder="Price"
      />
      <input
        type="number"
        value={quantity.stock}
        onChange={(e) => handleStockChange(quantity.volume!, parseInt(e.target.value))}
        className="ml-3 w-1/3 p-3 text-sm text-gray-700 border-2 outline-none transition rounded-md focus:ring ring-blue-600"
        placeholder="Stock"
      />
      <Trash2 className="cursor-pointer text-red-800" onClick={() => handleRemoveQuantity(quantity._id!)} />
    </div>
  ))}
</div>

          <div className="add-size-container flex gap-2 mt-4">
            <input
              type="text"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="Enter new size (e.g., 20ml, 100ml)"
              className="w-1/2 p-3 pl-10 text-sm text-gray-700"
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
        <div className="col-span-1">
          <label className="block mb-2 text-sm font-bold">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 pl-10 text-sm text-gray-700 border border-gray-400"
          >
            <option value="" disabled>Select Category</option>
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
            onChange={(e) => setSelectedGender(e.target.value)}
            className="w-full p-3 pl-10 text-sm text-gray-700 border border-gray-400"
          >
            <option value="" disabled>Select Gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        {/* Scent Type and Discount */}
        <div className="col-span-2 flex gap-4">
          <div className="w-1/2">
            <label className="block mb-2 text-sm font-bold">Scent Type</label>
            <select
              value={selectedScentType}
              onChange={(e) => setSelectedScentType(e.target.value as IProduct["ScentType"])}
              className="w-full p-3 pl-10 text-sm text-gray-700 border border-gray-400"
            >
              <option value="" disabled>Select Scent Type</option>
              <option value="Woody">Woody</option>
              <option value="Fruity">Fruity</option>
              <option value="Floral">Floral</option>
              <option value="Citrus">Citrus</option>
              <option value="Spicy">Spicy</option>
            </select>
          </div>

          <div className="w-1/2">
            <label className="block mb-2 text-sm font-bold">Discount Percentage</label>
            <input
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value === "" ? "" : parseFloat(e.target.value))}
              type="number"
              placeholder="Discount Percentage"
              className="w-full p-3 pl-10 text-sm text-gray-700 border border-gray-400"
            />
          </div>
        </div>

        {/* Existing Images */}
        <div className="col-span-2">
          <h2 className="text-2xl font-bold mb-5">Current Images</h2>
          <div className="flex gap-6 flex-wrap">
            {existingImages.map((img, idx) => (
              <div key={idx} className="relative w-44">
                <img className="w-full" src={img} alt={`Product ${idx + 1}`} />
                <button
                  onClick={() => handleRemoveExistingImage(idx)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          </div>
          </div>
          <Button
        ButtonHandler={updateProduct}
        text={loading?<PulseLoader color="#ffff" />:"Edit Product"}
        paddingVal={10}
      />
          </div>
  )}
export default AdminEditProduct