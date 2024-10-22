export interface IAddress {
    _id:string;
    Name: string; 
    FlatNumberOrBuildingName: string; 
    Locality: string; 
    Landmark?: string; 
    District: string; 
    State: string; 
    Pincode: string; 
    Phone: string; 
    addressType: string; 
    default?: boolean; 
}
