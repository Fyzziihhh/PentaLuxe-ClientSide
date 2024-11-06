export const addressValidation = (formState:any) => {
    const { 
      Name, 
      Phone, 
      Pincode, 
      Locality, 
      FlatNumberOrBuildingName, 
      Landmark, 
      District, 
      State 
    } = formState;
  
    // Trim whitespace from each field
    const trimmedName = Name.trim();
    const trimmedPhone = Phone.trim();
    const trimmedPincode = Pincode.trim();
    const trimmedLocality = Locality.trim();
    const trimmedFlatNumberOrBuildingName = FlatNumberOrBuildingName.trim();
    const trimmedLandmark = Landmark.trim();
    const trimmedDistrict = District.trim();
    const trimmedState = State.trim();
  
    // Check if any required field is empty after trimming
    if (!trimmedName) {
      return "Name is required.";
    }
    if (!trimmedPhone) {
      return "Phone number is required.";
    }
    if (!trimmedPincode) {
      return "Pincode is required.";
    }
    if (!trimmedLocality) {
      return "Locality is required.";
    }
    if (!trimmedFlatNumberOrBuildingName) {
      return "Flat Number or Building Name is required.";
    }
    if (!trimmedLandmark) {
      return "Landmark is required.";
    }
    if (!trimmedDistrict) {
      return "District is required.";
    }
    if (!trimmedState) {
      return "State is required.";
    }
  
    // Validate phone number format (e.g., 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      return "Phone number must be 10 digits.";
    }
  
    // Validate pincode format (e.g., 6 digits)
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(trimmedPincode)) {
      return "Pincode must be 6 digits.";
    }
  
    // If all validations pass, return null
    return null;
  };
  