import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import api from "../../services/apiService";
import { AxiosError } from "axios";
import { adminCategory } from "../../utils/endpoints";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../../components/DeleteModal";
import { FaPlus, FaEdit, FaTrash, FaUpload } from "react-icons/fa";
import Pagination from "@/components/Pagination";

 export interface ICategories {
  _id: string;
  categoryName: string;
  categoryImage: string;
}
const AdminCategoryPage = () => {
  const [paginatedCategories, setPaginatedCategories] = useState<ICategories[]>(
    []
  );

  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const isModalOpen = () => setIsModal(true);
  const isModelClose = () => {
    setCategoryName("");
    setCategoryImage(null);
    setIsModal(false);
  };
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<ICategories[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [itemId, setItemId] = useState("");
  const onCategoryAdd = async () => {
    if (!categoryImage || categoryName.trim() === "") {
      toast.error("All fields are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("categoryImage", categoryImage);
      formData.append("categoryName", categoryName);

      const response = await api.post(adminCategory, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        setRefresh((prev) => !prev);
        toast.success("The category has been created and is now available.");
        setCategoryName("");
        setCategoryImage(null);
        setIsModal(false);
      }
    } catch (error) {
      console.error("Error uploading category:", error);
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message || "Something Went Wrong");
    }
  };
  const onHandleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target.files) {
      setCategoryImage(event.target.files[0]);
    }
  };

  const openModal = (id: string) => {
    setModalIsOpen(true);
    setItemId(id);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  const onDeleteCategory = async (_id: string) => {
    try {
      const response = await api.delete(`/api/admin/categories/${_id}`);
      if (response.data.success) {
        toast.success("Category deleted successfully");
        setRefresh((prev) => !prev);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message || "Something Went Wrong");
    }
  };

  const getCategories = async () => {
    try {
      const response = await api.get("/api/admin/categories");
      if (response.data.success) {
        setCategories(response.data.categories);
        setPaginatedCategories(response.data.categories); // Set paginated categories here
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          navigate("/admin");
        }
      }
    }
  };

  const onEditCategory = (id: string) => {
    const category = categories.find((category) => id === category._id);
    if (category) {
      setCategoryName(category.categoryName);
      setIsModal(true);
      // setCategoryImage(category.categoryImage)
    }
  };

  const handlePagination = (items: ICategories[]) => {
    setPaginatedCategories(items);
  };

  useEffect(() => {
    getCategories();
  }, [refresh]);
  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen p-8">
      {/* Delete Modal */}
      <DeleteModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        item={itemId}
        onDelete={onDeleteCategory}
        text="Are you sure? All products belonging to this category will be deleted."
      />

      {/* Title */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        Manage Categories
      </h1>

      {/* Add Category Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={isModalOpen}
          className="bg-green-500 text-white py-3 px-5 rounded-lg shadow-lg hover:bg-green-600 transition flex items-center gap-2"
        >
          <FaPlus className="h-5 w-5" />
          Add Category
        </button>
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isModal}
        onRequestClose={isModelClose}
        contentLabel="Add New Category"
        className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative text-gray-700"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center"
      >
        <button
          onClick={isModelClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <FaTrash className="h-6 w-6" />
        </button>

        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-5">
          Create New Category
        </h2>

        <div className="space-y-5">
          {/* Category Name Input */}
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaEdit className="h-5 w-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Category Name"
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              className="w-full p-2 focus:outline-none"
            />
          </div>

          {/* Category Image Input */}
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaUpload className="h-5 w-5 text-gray-400 mr-3" />
            <input
              type="file"
              name="categoryImage"
              onChange={onHandleFile}
              className="w-full text-gray-600 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={onCategoryAdd}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
          >
            <FaUpload className="h-5 w-5" />
            Upload
          </button>
        </div>
      </Modal>

      {/* Category List Table */}
      <div className="overflow-x-auto mt-8">
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead className="bg-blue-500 text-white rounded-t-lg">
            <tr>
              <th className="p-4 text-left">Category Image</th>
              <th className="p-4 text-left">Category Name</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedCategories.map((category) => (
              <tr key={category._id} className="hover:bg-gray-100 transition">
                <td className="p-4">
                  <img
                    src={category.categoryImage}
                    alt={category.categoryName}
                    className="h-16 w-16 object-cover rounded-lg shadow"
                  />
                </td>
                <td className="p-4 text-gray-700">{category.categoryName}</td>
                <td className="p-4 text-center flex justify-center space-x-3">
                  {/* Edit Button */}
                  <button
                    onClick={() => onEditCategory(category._id)}
                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow hover:bg-yellow-600 transition flex items-center gap-2"
                  >
                    <FaEdit className="h-5 w-5" />
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => openModal(category._id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg shadow hover:bg-red-600 transition flex items-center gap-2"
                  >
                    <FaTrash className="h-5 w-5" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        items={categories}
        itemsPerPage={2}
        onPageChange={handlePagination}
      />
    </div>
  );
};

export default AdminCategoryPage;
