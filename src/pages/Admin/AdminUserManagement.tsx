import { ChangeEvent, useEffect, useState } from "react";
import api from "../../services/apiService";
import { adminGetAllUsers } from "../../utils/endpoints";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { AppHttpStatusCodes } from "@/types/statusCode";
import { toast } from "sonner";
import { IAddress } from "@/types/AddressTypes";
import Pagination from "@/components/Pagination";

interface IUser {
  _id: string;
  username: string;
  email: string;
  addresses?: IAddress[];
  phone: number;
  status: string;
}

const AdminUserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<IUser[]>([]); 
  const [displayedUsers, setDisplayedUsers] = useState<IUser[]>([]); // State for currently displayed users
  const [input, setInput] = useState('');

  const handlePagination = (users: IUser[]) => {
    setDisplayedUsers(users); // Update displayed users based on pagination
  };

  const getAllUsers = async () => {
    try {
      const response = await api(adminGetAllUsers);
      if (response.data.success) {
        setUsers(response.data.users);
        setDisplayedUsers(response.data.users.slice(0, 5)); // Default to the first page
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          navigate('/admin');
        }
      }
    }
  };
    const toggleBlock = async (id: string) => {
    const updatedUsers = (prevUsers: IUser[]) =>
      prevUsers.map((user) =>
        user._id === id
          ? { ...user, status: user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE" }
          : user
      );
  
    setUsers((prevUsers) => updatedUsers(prevUsers));
    setSearchedUsers((prevUsers) => updatedUsers(prevUsers)); // Update searchedUsers as well
  
    try {
      await api.patch("/api/admin/statusUpdate", {
        id,
        status: users.find((user) => user._id === id)?.status,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          navigate('/admin');
        }
      }
    }
  };

  const openConfirmModal=(userId:string)=>{
    toast.custom(
      (id) => (
        <div
          className="flex flex-col items-center p-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg rounded-lg border border-gray-300 transition-transform transform hover:scale-105"
          onClick={() => toast.dismiss(id)}
        >
          <p className="text-2xl font-bold">Confirm Action</p>
          <p className="text-sm mt-2 opacity-90">
            Are you sure you want to change the status?
          </p>
          <div className="flex space-x-4 mt-4">
            <button
              className="px-5 py-2 bg-blue-600 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              onClick={() => {
                toggleBlock(userId) ; 
                toast.dismiss(id);
              }}
            >
              Yes
            </button>
            <button
              className="px-5 py-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
              onClick={() => toast.dismiss(id)} // Dismiss toast on No
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
      }
    );
  }

  const onSearchUser = async () => {
    if (input.length === 0) {
      setSearchedUsers(users);
      setDisplayedUsers(users.slice(0, 5)); // Reset to first page with full users
      return;
    }

    try {
      const res = await api.post('/api/admin/search-user', { text: input });
      if (res.status === AppHttpStatusCodes.OK) {
        setSearchedUsers(res.data.users);
        setDisplayedUsers(res.data.users.slice(0, 5)); // Default to the first page
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.length === 0) {
      setSearchedUsers(users);
      setDisplayedUsers(users.slice(0, 5)); // Reset to first page
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="container mx-auto p-5 bg-gray-100">
      <div className="flex justify-between mb-5">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 border-b pb-4">User Management</h1>
        <div className="flex items-center">
          <input
            placeholder="Search for customer"
            type="text"
            value={input}
            onChange={handleInputChange}
            className="w-[300px] font-Lilita py-2 px-4 text-gray-700 rounded-lg mr-5 border border-purple-200"
          />
          <button onClick={onSearchUser} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
            Search
          </button>
        </div>
      </div>

      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden text-gray-700">
        <thead className="bg-purple-800 text-white">
          <tr>
            <th className="text-left py-3 px-4">Name</th>
            <th className="text-left py-3 px-4">Email</th>
            <th className="text-left py-3 px-4">Phone</th>
            <th className="text-left py-3 px-4">Address</th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-left py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map((user) => (
            <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-4">{user.username}</td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4">{user.phone || "N/A"}</td>
              <td className="py-3 px-4 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                {user.addresses?.length === 0 ? (
                  "No Addresses Found"
                ) : (
                  <p>
                    {user.addresses?.[0].Name}, {user.addresses?.[0].Locality},<br />
                    {user.addresses?.[0].District}, {user.addresses?.[0].State?.toUpperCase() || ""}
                    - {user.addresses?.[0].Pincode || ""}
                  </p>
                )}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`${
                    user.status === "ACTIVE" ? "bg-blue-500" : "bg-orange-500"
                  } text-white py-1 px-3 rounded-full text-sm`}
                >
                  {user.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => openConfirmModal(user._id)}
                  className={`${
                    user.status === "ACTIVE" ? "bg-red-500" : "bg-green-500"
                  } text-white py-2 px-4 rounded`}
                >
                  {user.status === "ACTIVE" ? "Block" : "Unblock"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination 
        items={input.length > 0 ? searchedUsers : users} 
        itemsPerPage={5} 
        onPageChange={handlePagination}
      />
    </div>
  );
};

export default AdminUserManagement;

