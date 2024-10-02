import React, { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Input from "../../components/Input/Input";
import api from "../../services/apiService";
import { AppHttpStatusCodes } from "../../types/statusCode";

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
  type FormKeys = 'Name' | 'Phone' | 'Pincode' | 'Locality' |
  'FlatNumberOrBuildingName' | 'Landmark' | 'District' | 'State';
const AddAndEditAddress = () => {
  const navigate=useNavigate()
  const { id } = useParams();
  const [addressType,setAddressType]=useState('')
  const [formState, setFormState] = useState<Record<FormKeys, string>>({
    Name: '',
    'Phone': '',
    Pincode: '',
    Locality: '',
    FlatNumberOrBuildingName: '',
    Landmark: '',
    District: '',
    State: ''
  });

  const onAddressHandler = async(e: FormEvent) => {
    e.preventDefault();
   try{
const res=await api.post('/api/user/address-book',{formState,addressType})
if(res.status===AppHttpStatusCodes.CREATED){
  navigate('/profile/address-book')
}
   }catch(err){

   }
  
  };
  const onInputHandler = (e: ChangeEvent<HTMLInputElement>): void => {
     const {name,value}=e.target
     
    setFormState(prevState => ({
        ...prevState,
        [name as FormKeys]: value 
      }));
  };
 

  return (
    <div className="h-full">
      <h1 className="text-center text-3xl font-Bowly">
        {id ? "Edit address" : "Add new address"}
      </h1>
      <form onSubmit={onAddressHandler}>
        <div className="flex  w-full flex-wrap mt-5  gap-3">
            {inputsArray.map(input=> <Input key={input.label} value={formState[input.label]} text={input.label} type={input.type} inputHandler={onInputHandler}/>)}
         
       
        </div>
        <div >
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
   </div>
</div>
<div className="buttons flex gap-5 mt-5 items-center">
  <button  className="bg-blue-700 text-white h-10  px-16">
    Save
  </button>
  <Link to='/profile/address-book' className="blue uppercase text-blue-800 font-bold">Cancel</Link>
 
</div>
      </form>
    </div>
  );
};

export default AddAndEditAddress;
