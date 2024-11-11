import { ChangeEvent, useEffect, useState } from "react";
import api from "../../services/apiService";
import { adminGetAllUsers } from "../../utils/endpoints";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { AppHttpStatusCodes } from "@/types/statusCode";
import { toast } from "sonner";

interface IUser {
  _id: string;
  username: string;
  email: string;
  addresses?: string[];
  phone: number;
  status: string;
}

const AdminUserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<IUser[]>([]); // Separate state for searched users
  const [input, setInput] = useState('');

  const getAllUsers = async () => {
    try {
      const response = await api(adminGetAllUsers);
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          navigate('/admin');
        }
      }
    }
  };

  // Toggle Block/Unblock status
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
  
  const onSearchUser = async () => {
    if (input.length === 0) {
      setSearchedUsers(users); 
      return; 
    }
    try {
      const res = await api.post('/api/admin/search-user', { text: input });
      if (res.status === AppHttpStatusCodes.OK) {
        setSearchedUsers(res.data.users); 
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

    // Show all users if input is empty
    if (value.length === 0) {
      setSearchedUsers(users);
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
          {(searchedUsers.length > 0 ? searchedUsers : users).map((user) => (
            <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-4">{user.username}</td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4">{user.phone||"N/A"}</td>
              <td className="py-3 px-4">
                {user.addresses?.length === 0 ? "No Addresses Found" : user.addresses?.[0]}
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
                  onClick={() => toggleBlock(user._id)}
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
    </div>
  );
};

export default AdminUserManagement;
