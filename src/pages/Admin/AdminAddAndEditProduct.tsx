import React, { ChangeEvent, useEffect, useState } from "react";
import api from "../../services/apiService";
import ImageCropper from "../../components/ImageCropper/ImageCropper";
import { convertBlobUrlsToFiles } from "../../utils/fileUpload";
import Button from "../../components/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
interface categories {
  _id: string;
  categoryName: string;
}
interface IQuantities {
  "20ml": string;
  "30ml": string;
  "50ml": string;
}
const AdminAddAndEditProduct = () => {
  const [categories, setCategories] = useState<categories[]>([]);
  const [quantities, setQuantities] = useState<IQuantities>({
    "20ml": "",
    "30ml": "",
    "50ml": "",
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { id } = useParams();

  const navigate = useNavigate();

  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedScentType, setSelectedScentType] = useState<string>("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [discountPrice, setDiscountPrice] = useState<number| ''>("");

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
      // Create a copy of the previous cropped images array
      const updatedCroppedImages = [...prevCroppedImages];

      // Replace the image at the current index, if it exists
      if (currentImageIndex < updatedCroppedImages.length) {
        updatedCroppedImages[currentImageIndex] = croppedImage; // Replace the existing image
      } else {
        // If cropping for the first time, just add the new cropped image
        updatedCroppedImages.push(croppedImage);
      }

      return updatedCroppedImages; // Return the updated array
    });

    const nextImageIndex = currentImageIndex + 1;

    // Move to the next image if there are more, otherwise stop cropping
    if (nextImageIndex < selectedImages.length) {
      setCurrentImageIndex(nextImageIndex); // Move to the next image
    } else {
      setShowCropper(false); // No more images to crop
    }
  };

  const handleCloseCropper = () => {
    setShowCropper(false); // Close cropper without saving
  };

  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [name]: value,
    }));
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
    Object.entries(quantities).forEach(([key, value]) => {
      if (!value || isNaN(value) || value < 0) {
        toast.error(
          `Invalid quantity for ${key}. It must be a non-negative number.`
        );
        return;
      }
    });
    if (!/^\d+$/.test(stock)) {
      toast.error("Stock must be a positive integer.");
      return;
    }
    // if (!/^\d+(\.\d{1,2})?$/.test(discountPrice)) {
    //   toast.error("Discount price must be a valid number and non-negative.");
    //   return;
    // }
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
      if (files.length === 0 && !isEditing) {
        toast.error("At least one image is required.");
        return;
      }

      const formData = new FormData();

      files.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });

      formData.append("productName", productName);
      formData.append("productDescription", description);
      formData.append("productStockQuantity", stock);
      formData.append("gender", selectedGender);
      formData.append("categoryName", selectedCategory);
      formData.append("productScentType", selectedScentType);
      formData.append("productDiscountPrice", String(discountPrice));

      Object.entries(quantities).forEach(([key, value]) => {
        formData.append(`productVolumes[${key}]`, value);
      });

      const endpoint = isEditing
        ? `/api/admin/products/${id}`
        : "/api/admin/products";
      const method = isEditing ? "PUT" : "POST";


      const response = await api.request({
        url: endpoint,
        method,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        navigate("/admin/products");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getCategories = async () => {
    const res = await api.get("/api/admin/categories");
    if (res.data.success) {
      setCategories(res.data.categories);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);
  useEffect(() => {
    if (id) {
      setIsEditing(true);

      // Fetch the product details by ID and populate the form fields
      const fetchProductDetails = async () => {
        try {
          const response = await api.get(`/api/admin/products/${id}`);
          const product = response.data.product;
          setProductName(product.productName);
          setDescription(product.productDescription);
          setStock(product.productStockQuantity);
          setDiscountPrice(product.productDiscountPrice);
          setSelectedGender(product.gender);
          setSelectedCategory(product.CategoryId.categoryName || "perfume");
          setSelectedScentType(product.productScentType);
          setQuantities({
            "20ml": product.productVolumes["20ml"] || "",
            "30ml": product.productVolumes["30ml"] || "",
            "50ml": product.productVolumes["50ml"] || "",
          });
          const imageUrls = product.productImages || [];
          setCroppedImages(imageUrls);
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      };

      fetchProductDetails();
    }
  }, [id]);

  return (
    <div className="w-full pb-5 text-grap-200 ">
      <h1 className="font-Bowly ml-10  text-4xl pt-7">Add New Product </h1>
      <div className="flex flex-wrap gap-4 ml-9 mt-5 justify-center">
        <input
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setProductName(event.target.value)
          }
          value={productName}
          placeholder="Product Name"
          type="text"
          className="w-[45%] h-12 border-2  px-3 py-3 rounded-xl text-gray-600 placeholder:text-gray-600 font-bold font-gilroy"
        />
        <textarea
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(event.target.value)
          }
          value={description}
          name="product-description"
          placeholder="Description"
          className=" w-[45%] h-36 p-3 rounded-xl resize-none   border-2 text-gray-600  placeholder:text-gray-600 font-bold font-gilroy"
        ></textarea>

        <div className=" px-5 w-[45%] -mt-10 py-3 shadow-2xl rounded-3xl border-2 ">
          <h1 className="font-gilroy font-bold text-2xl mb-5">
            Set Prices For Product :{" "}
          </h1>
          <div className="price-container flex flex-col gap-2 font-gilroy font-bold text-xl">
            <div>
              <span>20ml : </span>
              <input
                type="number"
                name="20ml"
                value={quantities["20ml"]}
                onChange={handleQuantityChange}
                className="ml-3 w-28 border-2 text-gray-500 rounded-xl py-1 px-2"
              />
            </div>
            <div>
              <span>30ml : </span>
              <input
                type="number"
                name="30ml"
                value={quantities["30ml"]}
                onChange={handleQuantityChange}
                className="ml-3 w-28 border-2  text-gray-500  rounded-xl py-1 px-2"
              />
            </div>
            <div>
              <span>50ml : </span>
              <input
                type="number"
                name="50ml"
                value={quantities["50ml"]}
                onChange={handleQuantityChange}
                className="ml-3 w-28 border-2  text-gray-500  rounded-xl py-1 px-2"
              />
            </div>
          </div>
        </div>

        <div className="category w-[45%]">
          {/* <h1 className="text-2xl font-gilroy font-bold">Category :</h1> */}
          <select
            className="block w-full text-gray-600  font-gilroy font-bold px-4 py-2 pr-8 border-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mt-2"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value); // Update the selected category
              console.log(e.target.value); // Log the selected value
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
        <input
          placeholder="Stock "
          type="number"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setStock(event.target.value)
          }
          value={stock}
          className="w-[45%] h-12 border-2 text-gray-600  mt-9 px-3 py-3 rounded-xl placeholder:text-gray-600 font-bold font-gilroy text-lg"
        />

        <div className="gender w-[45%]">
          {/* <h1 className="text-2xl font-gilroy font-bold">Gender :</h1> */}
          <select
            value={selectedGender}
            id="gender"
            onChange={handleGenderChange}
            className="block w-full font-gilroy text-gray-600 font-bold px-4 py-2 pr-8 border-2  rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mt-2 "
          >
            <option value="" selected disabled>
              Select Gender
            </option>

            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>
        <div className=" flex items-center justify-around w-full ml-9">
          <div className="scentType w-[45%]">
            {/* <h1 className="text-2xl font-gilroy font-bold">Scent Type :</h1> */}
            <select
              onChange={handleScentTypeChange}
              value={selectedScentType}
              className=" w-full text-gray-600 font-gilroy font-bold px-4 py-2 pr-8  border-2  rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mt-2 "
            >
              <option value="" selected disabled>
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
    setDiscountPrice(value === "" ? "" : parseFloat(value)); // Convert to number or keep as empty string
  }}
  value={discountPrice}
  placeholder="Discount price"
  type="number"
  className="h-12 border-2 text-gray-600 px-3 py-3 rounded-xl placeholder:text-gray-600 font-bold font-gilroy"
/>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
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
  className="absolute top-0 right-0 bg-wh shadow-md hover:bg-gray-200"
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
          text={isEditing ? "Update Product" : "Add Product"}
          paddingVal={10}
        />
      </div>
    </div>
  );
};

export default AdminAddAndEditProduct;
