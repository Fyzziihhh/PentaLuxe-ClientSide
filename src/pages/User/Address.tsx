import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppHttpStatusCodes } from "../../types/statusCode";
import api from "../../services/apiService";
import DeleteModal from "@/components/DeleteModal";
interface IAddress {
    _id:string;
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
  const [addresses, setAddresses] = useState<IAddress[] | []>([]);
  const [isModal, setIsModal] = useState(false);
  const [ItemId,setItemId] = useState('');
  const isModalOpen = (id:string) => {
    setIsModal(true)
    setItemId(id)

  }
  const isModelClose = () => {
    setIsModal(false)
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
    }
  };
  useEffect(() => {
    getAllAddresses();
  }, []);

  return (
    <div className="w-full">
       <DeleteModal
        isOpen={isModal}
        onRequestClose={isModelClose}
        item={ItemId}
        onDelete={onAddressDelete}
        text="Are you sure you want to delete this address?"
      />
      <div className="head text-center">
        <h1 className="text-4xl font-Bowly text-gray-800">Address Book</h1>
        <p className="text-lg font-almendra">
          Save all your addresses for a faster checkout experience.
        </p>
      </div>

      <div className="address-container mt-5 flex gap-3 w-full flex-wrap">
        <Link to="/profile/address-book/add ">
          <div className="address-box border-2 w-[19rem] h-[265px] content-center font-bold rounded-md  cursor-pointer">
            <p className="flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                >
                  <path d="M19.914 11.105A7 7 0 0 0 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0a32 32 0 0 0 .824-.738" />
                  <circle cx="12" cy="10" r="3" />
                  <path d="M16 18h6m-3-3v6" />
                </g>
              </svg>
              <span className="font-bold">Add new address</span>
            </p>
          </div>
        </Link>
        {addresses.map((address) => (
          <div key={address._id} className="address-box border-2 w-[19rem] h-[265px] p-2 rounded-lg hover:cursor-pointer">
            <h1 className="font-bold text-lg">
              {address.Name}
              <span className=" px-2 py-1 rounded-lg font-light ml-3 border-2 border-black text-base ">
                {address.addressType}
              </span>
            </h1>
            <span className="font-bold">Default</span>
            <div className="address font-gilroy ">
              <p className="mt-3">
                {`${address.FlatNumberOrBuildingName}, ${address.Locality}`}
                <br />
                {address.Landmark}
                <br />
                {`${address.District.toUpperCase()}, ${address.State.toUpperCase()}`}
              </p>

              <span>INDIA - {address.Pincode}</span>

              <p className="mt-5">Phone: {address.Phone}</p>
            </div>

            <div className="edit-delete flex gap-5 justify-between  mt-5 font-bold w-full ">
              <div className="flex gap-2">
                <p className="flex items-center cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="m18.988 2.012l3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287l-3-3L8 13z"
                    />
                    <path
                      fill="currentColor"
                      d="M19 19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2z"
                    />
                  </svg>
                  <Link to={`/profile/address-book/${address._id}`} className="ml-1 ">Edit</Link>
                </p>
                <p className="cursor-pointer" onClick={()=>isModalOpen(address._id)}>Delete</p>
              </div>
              <span className="font-bold ">Address Selected</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Address;
