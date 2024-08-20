import React, { lazy,Suspense } from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
const HomePage =lazy(()=>import('./pages/User/HomePage'))
const AboutPage = lazy(()=>import('./pages/User/AboutPage'))
const AllProductsPage =lazy(()=>import('./pages/User/AllProductsPage'))
const LoginPage = lazy(()=>import('./pages/User/LoginPage'))
import MinimalLayout from './layout/MinimalLayout'
import OtpVerifyPage from './pages/User/OtpVerifyPage'
const SignupPage =lazy(()=> import( './pages/User/SignupPage') ) 
const App = () => {

  return (
 <>
<Router>
  <Suspense fallback='Loading'>
  <Routes>
    <Route path='/' element={<MainLayout/>}>
    <Route index element={<HomePage/>}/>
    <Route path='about' element={<AboutPage/>}/>
    <Route path='products' element={<AllProductsPage/>}/>
    </Route>
    
    <Route element={<MinimalLayout/>}>
    <Route path='login' element={<LoginPage/>}/>
    <Route path='register' element={<SignupPage/>}/>
    <Route path="otp-verify/:id" element={<OtpVerifyPage/>}/>

    </Route>
  </Routes>
  </Suspense>
</Router>
 </>


  
  )
}

export default App
