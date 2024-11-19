
import { clearSearchedProducts, setSearchedProducts } from "@/store/slices/searchSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./SearchIcon.module.css";
import api from "@/services/apiService";
import { useDispatch } from "react-redux";

const SearchIcon = () => {
  const [SearchInput, setSearchInput] = useState("");
  const dispatch = useDispatch(); 
  const navigate = useNavigate();

  const onSearchHandler = async () => {
    if (SearchInput.length > 0) {
      dispatch(clearSearchedProducts());
      const res = await api.post("/api/user/search-products-by-category", {
        text: SearchInput,
      });
      if (res.status === 200) {
        dispatch(setSearchedProducts(res.data.searchedProducts));
        setSearchInput("");
        navigate("/products");
      }
    }
  };
  
  return (
    <div className={styles.inputWrapper}>
      {" "}
      {/* Use class from CSS module */}
      <button onClick={onSearchHandler} className={styles.icon}>
        {" "}
        {/* Use class from CSS module */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          height="25px"
          width="25px"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="1.5"
            stroke="#fff"
            d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
          ></path>
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="1.5"
            stroke="#fff"
            d="M22 22L20 20"
          ></path>
        </svg>
      </button>
      <input
        value={SearchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="search.."
        className={styles.input}
        name="text"
        type="text"
      />{" "}
      {/* Use class from CSS module */}
    </div>
  );
};

export default SearchIcon;
