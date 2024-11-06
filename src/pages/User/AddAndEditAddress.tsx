import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Input from "../../components/Input/Input";
import api from "../../services/apiService";
import { AppHttpStatusCodes } from "../../types/statusCode";
import { toast } from "sonner";
import { addressValidation } from "@/utils/AddressValidation";


interface InputField {
  label: FormKeys;
  type: string;
}

const inputsArray: InputField[] = [
  { label: "Name", type: "text" },
  { label: "Phone", type: "number" },
  { label: "Pincode", type: "number" },
  { label: "Locality", type: "text" },
  { label: "FlatNumberOrBuildingName", type: "text" },
  { label: "Landmark", type: "text" },
  { label: "State", type: "text" },
  { label: "District", type: "text" },
];
type FormKeys =
  | "Name"
  | "Phone"
  | "Pincode"
  | "Locality"
  | "FlatNumberOrBuildingName"
  | "Landmark"
  | "District"
  | "State";
const AddAndEditAddress = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [addressType, setAddressType] = useState("");
  const [formState, setFormState] = useState<Record<FormKeys, string>>({
    Name: "",
    Phone: "",
    Pincode: "",
    Locality: "",
    FlatNumberOrBuildingName: "",
    Landmark: "",
    District: "",
    State: "",
  });

  const onAddressHandler = async (e: FormEvent, action: string) => {
    e.preventDefault();
    const validationError = addressValidation(formState);
    if (validationError) {
      toast.error(validationError); 
      return;
    }
    try {
      let res;

      if (action === "Add") {
        res = await api.post("/api/user/address-book", {
          formState,
          addressType,
        });
      } else {
        res = await api.put("/api/user/address-book", {
          formState,
          addressType,
          addressId:id

        });
      }

      if (res.status === AppHttpStatusCodes.CREATED || AppHttpStatusCodes.OK) {
        navigate("/profile/address-book");
      }
    } catch (err) {
      toast.error("Error adding/updating address:");
    }
  };
  const onInputHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setFormState((prevState) => ({
      ...prevState,
      [name as FormKeys]: value,
    }));
  };

  useEffect(() => {
    if (id) {
      const fetchAddress = async () => {
        try {
          const response = await api.get(`/api/user/address-book/${id}`);
          console.log("addresssss",response)
          setFormState(response.data.data);
          setAddressType(response.data.data.addressType)
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      };

      fetchAddress();
    }
  }, [id]);

  return (
    <div className="h-full">
      <h1 className="text-center text-3xl font-Bowly">
        {id ? "Edit address" : "Add new address"}
      </h1>
      <form>
        <div className="flex  w-full flex-wrap mt-5  gap-3">
          {inputsArray.map((input) => (
            <Input
              key={input.label}
              value={formState[input.label]}
              text={input.label}
              type={input.type}
              inputHandler={onInputHandler}
            />
          ))}
        </div>
        <div>
          <h1>Address Type</h1>
          <div className="address-radio flex gap-5">
            <div className="flex gap-2">
              <input
                value="home" // Set the value specific to this option
                type="radio"
                name="addressType"
                id="home"
                checked={addressType === "home"}
                onChange={(e) => setAddressType(e.target.value)}
              />
              <p>Home</p>
            </div>

            <div className="flex gap-2">
              <input
                value="work"
                type="radio"
                name="addressType"
                id="work"
                checked={addressType === "work"} // This ensures the correct radio button is checked
                onChange={(e) => setAddressType(e.target.value)}
              />
              <p>Work</p>
            </div>
            <div className="flex gap-2">
              <input
                value="Other"
                type="radio"
                name="addressType"
                id="Other"
                checked={addressType === "Other"} // This ensures the correct radio button is checked
                onChange={(e) => setAddressType(e.target.value)}
              />
              <p>Other</p>
            </div>
          </div>
        </div>
        <div className="buttons flex gap-5 mt-5 items-center">
          <button
            onClick={(e) => {
              onAddressHandler(e, id ? "Edit" : "Add");
            }}
            className="bg-blue-700 text-white h-10  px-16"
          >
            {id ? "Edit" : "Add"}
          </button>
          <Link
            to="/profile/address-book"
            className="blue uppercase text-blue-800 font-bold"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AddAndEditAddress;
