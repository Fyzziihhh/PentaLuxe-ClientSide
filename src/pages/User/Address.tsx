import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppHttpStatusCodes } from "../../types/statusCode";
import api from "../../services/apiService";
import DeleteModal from "@/components/DeleteModal";

interface IAddress {
  _id: string;
  Name: string;
  Phone: string;
  Pincode: string;
  Locality: string;
  FlatNumberOrBuildingName: string;
  Landmark: string;
  District: string;
  State: string;
  addressType: string;
}

const Address = () => {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [isModal, setIsModal] = useState(false);
  const [ItemId, setItemId] = useState("");

  const isModalOpen = (id: string) => {
    setIsModal(true);
    setItemId(id);
  };

  const isModalClose = () => {
    setIsModal(false);
  };

  const getAllAddresses = async () => {
    const res = await api.get("/api/user/address-book");
    if (res.status === AppHttpStatusCodes.OK) {
      setAddresses(res.data.data);
    }
  };

  const onAddressDelete = async () => {
    const res = await api.delete(`/api/user/address-book/${ItemId}`);
    if (res.status === AppHttpStatusCodes.OK) {
      setAddresses((prevAddresses) => prevAddresses.filter(address => address._id !== ItemId));
      isModalClose(); // Close modal after deletion
    }
  };

  useEffect(() => {
    getAllAddresses();
  }, []);

  return (
    <div className="container mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
      <DeleteModal
        isOpen={isModal}
        onRequestClose={isModalClose}
        item={ItemId}
        onDelete={onAddressDelete}
        text="Are you sure you want to delete this address?"
      />
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white">Address Book</h1>
        <p className="text-lg text-gray-400">
          Save all your addresses for a faster checkout experience.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/profile/address-book/add">
          <div className="flex items-center justify-center border-2 border-gray-700 rounded-lg p-4 bg-gray-800 shadow hover:bg-gray-700 transition duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              viewBox="0 0 24 24"
              className="mr-2 text-gray-400"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              >
                <path d="M19.914 11.105A7 7 0 0 0 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0a32 32 0 0 0 .824-.738" />
                <circle cx="12" cy="10" r="3" />
                <path d="M16 18h6m-3-3v6" />
              </g>
            </svg>
            <span className="font-bold text-white">Add new address</span>
          </div>
        </Link>

        {addresses.map((address) => (
          <div key={address._id} className="address-box border-2 border-gray-700 bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition duration-200 w-80">
            <h1 className="font-bold text-lg text-white">
              {address.Name}
              <span className="ml-3 px-2 py-1 bg-gray-700 text-gray-300 rounded-md">
                {address.addressType}
              </span>
            </h1>
            <p className="text-sm text-gray-400">Default</p>
            <div className="mt-3 text-gray-300">
              <p>
                {`${address.FlatNumberOrBuildingName}, ${address.Locality}`}
                <br />
                {address.Landmark}
                <br />
                {`${address.District.toUpperCase()}, ${address.State.toUpperCase()}`}
              </p>
              <span className="text-sm text-gray-400">INDIA - {address.Pincode}</span>
              <p className="mt-5 font-bold">Phone: {address.Phone}</p>
            </div>
            <div className="flex justify-end item-center mt-5">
              <div className="flex gap-3">
                <Link to={`/profile/address-book/${address._id}`} className="text-blue-400 hover:underline">Edit</Link>
                <button className="text-red-400 hover:underline" onClick={() => isModalOpen(address._id)}>Delete</button>
              </div>
            
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Address;
