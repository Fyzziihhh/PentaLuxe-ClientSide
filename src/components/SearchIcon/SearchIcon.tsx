import React, { useState } from 'react';
import styles from './SearchIcon.module.css'; // Import CSS module
import api from '@/services/apiService';
import { AppHttpStatusCodes } from '@/types/statusCode';
import { useNavigate } from 'react-router-dom';

const SearchIcon = () => {
  const [SearchInput,setSerachInput]=useState('')
  const navigate=useNavigate()
  const onSearchHandler=async()=>{
  if(SearchInput.length>0){
    alert('hel')
    const res=await api.post('/api/user/search-products-by-category',{text:SearchInput})
    if(res.status===AppHttpStatusCodes.OK){
      setSerachInput('')
      navigate('/products',{state:{products:res.data.data}})
    }
  }
  }
  return (
    <div className={styles.inputWrapper}> {/* Use class from CSS module */}
      <button onClick={onSearchHandler} className={styles.icon}> {/* Use class from CSS module */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="25px" width="25px">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" stroke="#fff" d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"></path>
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" stroke="#fff" d="M22 22L20 20"></path>
        </svg>
      </button>
      <input value={SearchInput} onChange={(e)=>setSerachInput(e.target.value)} placeholder="search.." className={styles.input} name="text" type="text"/> {/* Use class from CSS module */}
    </div>
  );
};

export default SearchIcon;
