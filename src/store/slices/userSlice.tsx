import { createSlice } from "@reduxjs/toolkit";


interface IUser{
    user:null | true
}

const initialState:IUser={
    user:null
}

const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        LogIn:(state)=>{
             state.user=true
        },
        logOut:(state)=>{
            state.user=null
        }
    }

})

export const{LogIn,logOut} =userSlice.actions
export default userSlice.reducer

