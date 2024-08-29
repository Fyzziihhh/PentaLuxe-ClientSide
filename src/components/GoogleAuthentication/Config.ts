import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from  'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyBG0wjHiV1PCEMqCgp_bvfu8XaMWXh8Uuw",
  authDomain: "pentaluxe-ecommerce.firebaseapp.com",
  projectId: "pentaluxe-ecommerce",
  storageBucket: "pentaluxe-ecommerce.appspot.com",
  messagingSenderId: "431788007804",
  appId: "1:431788007804:web:d8db03f5b9e27f5cf4c4f9",
  measurementId: "G-E1ZEME9Q9F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app);
const provider= new GoogleAuthProvider();

export { auth,provider}