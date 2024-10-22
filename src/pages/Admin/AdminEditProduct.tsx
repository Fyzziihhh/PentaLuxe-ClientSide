// src/pages/AdminEditProduct/AdminEditProduct.tsx

import React, { ChangeEvent, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/apiService";
import ImageCropper from "../../components/ImageCropper/ImageCropper";
import { convertBlobUrlsToFiles } from "../../utils/fileUpload";
import Button from "../../components/Button/Button";
import { toast } from "sonner";
import { AxiosError } from "axios";

type Variant = {
  variant: string;
  price: number;
  stock: number;
};

type Category = {
  _id: string;
  categoryName: string;
};

interface ProductImage {
  url: string;
  _id: string;
}

import { IProduct } from "@/types/productTypes";

const AdminEditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State Management
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [newVariant, setNewVariant] = useState<Variant>({
    variant: "",
    price: 0,
    stock: 0,
  });

  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedScentType, setSelectedScentType] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [discountPercentage, setDiscountPercentage] = useState<number | "">("");

  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [showCropper, setShowCropper] = useState<boolean>(false);
  const [croppedImage, setCroppedImage] = useState<string>("");

  // Fetch Categories and Product Data


  // Handle Image Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setNewImages((prev) => [...prev, ...fileArray]);
      const urls = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...urls]);
      setShowCropper(true);
      setCurrentImageIndex(previewImages.length);
    }
  };

  // Handle Crop Completion
  const handleCropComplete = (croppedImageUrl: string) => {
    setPreviewImages((prev) => {
      const updated = [...prev];
      updated[currentImageIndex] = croppedImageUrl;
      return updated;
    });

    setShowCropper(false);
    setCroppedImage("");
  };

  // Handle Cropper Close
  const handleCloseCropper = () => {
    setShowCropper(false);
    setCroppedImage("");
  };

  // Handle Variant Changes
  const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: string | number
  ) => {
    const updatedVariants = [...variants];
    if (typeof updatedVariants[index][field] === "number") {
      updatedVariants[index][field] = Number(value);
    } else {
      updatedVariants[index][field] = value as string;
    }
    setVariants(updatedVariants);
  };

  // Add New Variant
  const handleAddVariant = () => {
    if (newVariant.variant.trim() === "") {
      toast.error("Variant name is required.");
      return;
    }
    if (variants.some((v) => v.variant === newVariant.variant)) {
      toast.error("Variant already exists.");
      return;
    }
    setVariants([...variants, newVariant]);
    setNewVariant({ variant: "", price: 0, stock: 0 });
  };

  // Remove Variant
  const handleRemoveVariant = (index: number) => {
    const updatedVariants = [...variants];
    updatedVariants.splice(index, 1);
    setVariants(updatedVariants);
  };

  // Remove Existing Image
  const handleRemoveExistingImage = (imageId: string) => {
    setExistingImages((prev) => prev.filter((img) => img._id !== imageId));
    setRemovedImageIds((prev) => [...prev, imageId]);
    setPreviewImages((prev) => prev.filter((url) => url !== existingImages.find((img) => img._id === imageId)?.url));
  };

  // Remove New Image
  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };


  const handleSubmit = async () => {

    if (!productName.trim()) {
      toast.error("Product name is required.");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required.");
      return;
    }
    if (variants.length === 0) {
      toast.error("At least one variant is required.");
      return;
    }
    for (const variant of variants) {
      if (!variant.variant.trim()) {
        toast.error("Variant name cannot be empty.");
        return;
      }
      if (variant.price < 0 || variant.stock < 0) {
        toast.error(`Price and Stock for variant "${variant.variant}" must be non-negative.`);
        return;
      }
    }
    if (!selectedGender) {
      toast.error("Gender is required.");
      return;
    }
    if (!selectedCategoryId) {
      toast.error("Category is required.");
      return;
    }
    if (!selectedScentType) {
      toast.error("Scent type is required.");
      return;
    }
    if (discountPercentage === "" || discountPercentage < 0 || discountPercentage > 100) {
      toast.error("Discount Percentage must be between 0 and 100.");
      return;
    }
    if (existingImages.length === 0 && newImages.length === 0) {
      toast.error("At least one image is required.");
      return;
    }

    try {
      const formData = new FormData();

      // Append new images
      newImages.forEach((file) => {
        formData.append("newImages", file);
      });

      // Append removed image IDs
      removedImageIds.forEach((id) => {
        formData.append("removedImageIds", id);
      });

      // Append other fields
      formData.append("Name", productName);
      formData.append("Description", description);
      formData.append("Gender", selectedGender);
      formData.append("CategoryId", selectedCategoryId);
      formData.append("ScentType", selectedScentType);
      formData.append("DiscountPercentage", String(discountPercentage));

      // Append variants as JSON string
      formData.append("PriceStockVariant", JSON.stringify(variants));

      const response = await api.put(`/api/admin/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/admin/products");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Failed to update product.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="container mx-auto p-5">
    <h1 className="text-3xl font-bold mb-5">Edit Product</h1>
  
    <div className="grid grid-cols-2 gap-4">
      {/* Product Name */}
      <div className="col-span-1">
        <label className="block mb-2 text-sm font-bold">Product Name</label>
        <input
          onChange={(e: ChangeEvent<HTMLInputElement>) => setProductName(e.target.value)}
          value={productName}
          placeholder="Product Name"
          type="text"
          className="w-full p-3 pl-10 text-sm text-gray-700"
        />
      </div>
  
      {/* Description */}
      <div className="col-span-1">
        <label className="block mb-2 text-sm font-bold">Description</label>
        <textarea
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          value={description}
          name="product-description"
          placeholder="Description"
          className="w-full h-36 p-3 pl-10 text-sm text-gray-700 resize-none"
        ></textarea>
      </div>
  
      {/* Price and Stock Variants */}
      <div className="col-span-2">
        <h2 className="text-2xl font-bold mb-5">Price and Stock Variants</h2>
        <div className="variants-container">
          {variants.map((variant, index) => (
            <div key={index} className="flex gap-4 mb-4">
              <input
                type="text"
                value={variant.variant}
                onChange={(e) => handleVariantChange(index, "variant", e.target.value)}
                placeholder="Variant (e.g., 20ml)"
                className="w-1/3 p-3 pl-10 text-sm text-gray-700"
              />
              <input
                type="number"
                value={variant.price}
                onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                placeholder="Price"
                className="w-1/3 p-3 pl-10 text-sm text-gray-700"
              />
              <input
                type="number"
                value={variant.stock}
                onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                placeholder="Stock"
                className="w-1/3 p-3 pl-10 text-sm text-gray-700"
              />
              <button
                onClick={() => handleRemoveVariant(index)}
                className="text-red-500 font-bold"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
  
        {/* Add New Variant */}
        <div className="add-variant-container flex gap-2 mt-4">
          <input
            type="text"
            value={newVariant.variant}
            onChange={(e) => setNewVariant({ ...newVariant, variant: e.target.value })}
            placeholder="Variant (e.g., 50ml)"
            className="w-1/3 p-3 pl-10 text-sm text-gray-700"
          />
          <input
            type="number"
            value={newVariant.price}
            onChange={(e) => setNewVariant({ ...newVariant, price: Number(e.target.value) })}
            placeholder="Price"
            className="w-1/3 p-3 pl-10 text-sm text-gray-700"
          />
          <input
            type="number"
            value={newVariant.stock}
            onChange={(e) => setNewVariant({ ...newVariant, stock: Number(e.target.value) })}
            placeholder="Stock"
            className="w-1/3 p-3 pl-10 text-sm text-gray-700"
          />
          <button
            onClick={handleAddVariant}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Variant
          </button>
        </div>
      </div>
  
      {/* Category Selection */}
      <div className="col-span-1">
        <label className="block mb-2 text-sm font-bold">Category</label>
        <select
          className="w-full p-3 pl-10 text-sm text-gray-700"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
        >
          <option value="" disabled>
            Select Category
          </option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.categoryName}
            </option>
          ))}
        </select>
      </div>
  
      {/* Gender Selection */}
      <div className="col-span-1">
        <label className="block mb-2 text-sm font-bold">Gender</label>
        <select
                 value={selectedGender}
                 onChange={(e) => setSelectedGender(e.target.value)}
                 className="w-full p-3 pl-10 text-sm text-gray-700"
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
                   onChange={(e) => setSelectedScentType(e.target.value)}
                   value={selectedScentType}
                   className="w-full p-3 pl-10 text-sm text-gray-700"
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
                   onChange={(e: ChangeEvent<HTMLInputElement>) => {
                     const value = e.target.value;
                     setDiscountPercentage(value === "" ? "" : parseFloat(value));
                   }}
                   value={discountPercentage}
                   placeholder="Discount Percentage"
                   type="number"
                   min="0"
                   max="100"
                   className="w-full p-3 pl-10 text-sm text-gray-700"
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
             {showCropper && croppedImage && (
               <div className="col-span-2">
                 <ImageCropper
                   imageSrc={croppedImage}
                   onClose={handleCloseCropper}
                   onCropComplete={handleCropComplete}
                 />
               </div>
             )}
         
             {/* Existing Images */}
             <div className="col-span-2">
               <h2 className="text-2xl font-bold mb-5">Existing Images</h2>
               <div className="flex gap-6 flex-wrap">
                 {existingImages.map((img) => (
                   <div key={img._id} className="relative w-44">
                     <img className="w-full rounded-lg" src={img.url} alt={`Existing ${img._id}`} />
                     <button
                       className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                       onClick={() => handleRemoveExistingImage(img._id)}
                       title="Remove Image"
                     >
                       &times;
                     </button>
                   </div>
                 ))}
               </div>
             </div>
         
             {/* New Images Preview */}
             <div className="col-span-2">
               <h2 className="text-2xl font-bold mb-5">New Images</h2>
               <div className="flex gap-6 flex-wrap">
                 {previewImages.map((img, idx) => (
                   <div key={idx} className="relative w-44">
                     <img className="w-full rounded-lg" src={img} alt={`New ${idx}`} />
                     <button
                       className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                       onClick={() => handleRemoveNewImage(idx)}
                       title="Remove Image"
                     >
                       &times;
                     </button>
                   </div>
                 ))}
               </div>
             </div>
         
             {/* Submit Button */}
             <div className="w-full flex justify-center mt-5">
               <Button
                 ButtonHandler={handleSubmit}
                 text="Update Product"
                 paddingVal={10}
               />
             </div>
           </div>
         </div>
  );
};

export default AdminEditProduct;
