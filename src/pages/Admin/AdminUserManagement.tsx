import { useEffect, useState } from "react";
import api from "../../services/apiService";
import { adminGetAllUsers } from "../../utils/endpoints";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
interface IUser {

  _id: string;
  username: string;
  email: string;
  addresses?: string[];
  phone: number;
  status: string;

}
const AdminUserManagement = () => {
  const navigate=useNavigate()
  const [users, setUsers] = useState<IUser[]>([]);
  const getAllUsers = async () => {
    try {
      const response = await api(adminGetAllUsers);
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
     
      if(error instanceof AxiosError){
  
        if(error.response?.status===403){
          navigate('/admin')
        }
      }
    }
  };

  // Toggle Block/Unblock status
  const toggleBlock = async (id: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === id
          ? { ...user, status: user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE" }
          : user
      )
    );
    // const user = users.find((user) => user._id === id);
   try {
     await api.patch("/api/admin/statusUpdate", {
       id,
       status: users.find((user) => user._id === id)?.status,
     });
    
   } catch (error) {
    if(error instanceof AxiosError){
  
      if(error.response?.status===403){
        navigate('/admin')
      }
    }
   }
  
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <div className=" w-full mb-5 border h-full">
      <h1 className="font-Bowly text-4xl m-11">User ManageMent</h1>

      <input
        placeholder="search for  customer"
        type="text"
        className="w-[300px] font-Lilita py-2 px-4 text-black rounded-lg ml-10 outline-none border none"
      />
      <table className="w-[95%] bg-white shadow-md rounded-lg overflow-hidden text-black mx-auto mt-5">
        <thead className="bg-gray-800 text-white">
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
          {users.map((user) => (
            <tr
              key={user._id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-4">{user.username}</td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4">{user.phone}</td>
              <td className="py-3 px-4">
                {user.addresses?.length === 0
                  ? "No Addresses Founded"
                  : user.addresses?.[0]}
              </td>

              <td className="py-3 px-4">
                <span
                  className={`${
                    user.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
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
