import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from './Config';
import { signInWithPopup } from 'firebase/auth';
import api from '../../services/apiService';

const SignIn = () => {
    const navigate = useNavigate();

const handleSignIn=()=>{
    signInWithPopup(auth,provider).then(async(data)=>{ 
        if(data.user){
        try {
            const response=await api.post('/api/user/google-auth',{username:data.user.displayName,email:data.user.email})
            if(response.data.success){
                alert(response.data.message)
                localStorage.setItem("accessToken",response.data.accessToken)
                localStorage.setItem("refreshToken",response.data.refreshToken)
                navigate('/')
            }
        } catch (error:any) {
            alert("ERROR IS HERE")
            alert(error?.response?.data.message)
        }
        }
    })
}

    return (
        <div>
            <button className='flex items-center font-gilroy font-extrabold bg-white text-black rounded-xl px-6 gap-3' onClick={handleSignIn}>
                <img className="w-12 h-12 object-cover" src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png" alt="Google Logo" />
                Sign in with Google
            </button>
        </div>
    );
};

export default SignIn;
