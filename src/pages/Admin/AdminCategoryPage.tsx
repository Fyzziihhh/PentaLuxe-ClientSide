import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import api from "../../services/apiService";
import { AxiosError } from "axios";

interface categories {
  _id: string;
  categoryName: string;
  categoryImage: string;
}
const AdminCategoryPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const isModalOpen = () => setIsModal(true);
  const isModelClose = () => setIsModal(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<categories[]>([]);
  const onCategoryAdd = async () => {
    if (!categoryImage || categoryName.trim() === "") {
      alert("All fields are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("categoryImage", categoryImage);
      formData.append("categoryName", categoryName);
      alert(categoryImage.name);
      const response = await api.post("/api/admin/upload-category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        setRefresh((prev) => !prev);
        alert("Category added successfully");
        setCategoryName("");
        setCategoryImage(null);
        setIsModal(false);
      }
    } catch (error) {
      console.error("Error uploading category:", error);
      if(error instanceof AxiosError) alert(error.response?.data.message || "Something Went Wrong")
    }
  };
  const onHandleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target.files) {
      setCategoryImage(event.target.files[0]);
    }
  };

  const onDeleteCategory = async (_id: string) => {
    const response = await api.delete(`/api/admin/categories/${_id}`);
    if (response.data.success) {
      setRefresh((prev) => !prev);
    }
  };

  const getCategories = async () => {
    try {
      const response = await api.get("/api/admin/categories");
      if (response.data.success) {
        setCategories(response.data.categories);
        console.log(categories);
      }
    } catch (error) {
      if(error instanceof AxiosError) alert(error.response?.data.message);
    }
  };

  useEffect(() => {
    getCategories();
  }, [refresh]);
  return (
    <div className="category-container  bg-zinc-100 ">
      <h1 className="text-4xl font-Bowly text-black text-center ">
        Category Management
      </h1>
      <button
        onClick={isModalOpen}
        className="bg-[#0043F4] flex items-center justify-center p-3 rounded-xl font-gilroy text-xl gap-3 font-bold ml-5 mt-5 "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2rem"
          height="2rem"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M2 2h9v9H2zm15.5 0C20 2 22 4 22 6.5S20 11 17.5 11S13 9 13 6.5S15 2 17.5 2m-11 12l4.5 8H2zM19 17h3v2h-3v3h-2v-3h-3v-2h3v-3h2z"
          />
        </svg>
        Add Category
      </button>
      <Modal
        isOpen={isModal}
        onRequestClose={isModelClose}
        contentLabel="Add New Category"
        className="w-2/6 flex flex-col justify-center items-center m-auto mt-5 p-6 rounded-xl bg-white relative shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        {/* Close Button */}
        <button
          onClick={isModelClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none text-3xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M105.367 18.328c23.14 15.444 46.098 31.27 68.55 47.572c-45.055-20.895-94.51-35.918-149.37-44.246c46.697 26.72 91.596 55.58 135.705 85.524c-37.203-18.033-77.48-32.22-121.602-41.37c58.218 34.322 109.368 72.465 154.71 114.206C136.02 227.227 86.295 284.717 45.79 354.18c27.11-24.29 54.91-47.545 82.868-70.68C81.942 339.36 45.05 405.01 20.2 482.135c20.36-24.62 40.988-48.203 61.905-70.817c44.7-67.485 89.567-147.11 148.856-170.418c-29.61 30.708-63.36 75.164-98.25 118.145c40.99-40.437 83.09-77.46 126.415-111.512c61.598 70.49 110.757 149.38 152.145 235.873c-6.738-44.794-16.796-87.384-30.03-127.666l46.444 65.53s-26.037-72.69-43.66-101.987c40.76 55.91 78.208 114.428 112.328 175.205c-18.674-89.454-50.512-169.772-98.893-238.224a1783 1783 0 0 1 100.93 109.045C465.048 288.827 423.58 221.82 372.214 167c40.224-25.887 81.48-49.73 123.863-71.783a757 757 0 0 0-92.006 21.934c21.836-16.173 44.41-32.124 67.024-47.523c-37.987 11.91-74.633 25.775-109.067 41.433c42.668-27.673 86.32-53.668 131.004-78.602h-.003c-67.47 18.055-130.83 42.19-188.998 73.548c-56.294-41.79-122.01-71.787-198.663-87.68z"
            />
          </svg>
        </button>

        <div className="max-w-md bg-white mx-auto p-8 rounded-xl shadow-lg">
          <h1 className="mb-6 text-2xl font-gilroy text-center text-gray-800">
            Create New Category
          </h1>

          <div className="space-y-6">
            <input
              type="text"
              placeholder="Category Name"
              className="w-full px-5 py-3 rounded-lg border border-gray-300 outline-none placeholder-gray-500 text-gray-800 font-bold font-gilroy focus:ring-2 focus:ring-indigo-500"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setCategoryName(event.target.value)
              }
            />
            //category Image File
            <input type="file" name="categoryImage" onChange={onHandleFile} className=" text-black"  />
            <button
              onClick={onCategoryAdd}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold font-gilroy transition"
            >
              Upload
            </button>
          </div>
        </div>
      </Modal>

      <table className="text-black font-gilroy font-bold mt-5 border-4 w-[80%] mx-auto ">
        <thead className="flex justify-between items-center px-16 py-5">
          <tr className="text-xl flex gap-10 items-center justify-between w-full">
            <th className="w-32 text-center">Category Image</th>
            <th className="flex-1 text-center">Category Name</th>
            <th className="flex-1 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="flex flex-col gap-5 w-full pb-5">
          {categories.map((category) => (
            <tr
              key={category._id}
              className="text-lg flex gap-10 items-center justify-between px-16 mt-5"
            >
              <td className="w-28  h-32 text-center">
                <img
                  className="h-full w-full object-cover rounded-lg"
                  src={category.categoryImage}
                  alt="Attars"
                />
              </td>
              <td className="flex-1 text-center">{category.categoryName}</td>
              <td className="flex gap-5 justify-center flex-1">
                <button className="px-5 py-3 bg-green-700 rounded-xl text-white">
                  Edit
                </button>
                <button
                  className="px-5 py-3 bg-red-700 rounded-xl text-white "
                  onClick={() => onDeleteCategory(category._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCategoryPage;
