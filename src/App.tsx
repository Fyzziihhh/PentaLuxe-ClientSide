import React, { lazy,Suspense } from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
const HomePage =lazy(()=>import('./pages/User/HomePage'))
const AboutPage = lazy(()=>import('./pages/User/AboutPage'))
const AllProductsPage =lazy(()=>import('./pages/User/AllProductsPage'))
const LoginPage = lazy(()=>import('./pages/User/LoginPage'))
import MinimalLayout from './layout/MinimalLayout'
import OtpVerifyPage from './pages/User/OtpVerifyPage'
import AdminLoginPage from './pages/Admin/AdminLoginPage'
import AdminDashboard from './pages/Admin/AdminDashboardPage'
import AdminProductPage from './pages/Admin/AdminProductPage'
import AdminCategoryPage from './pages/Admin/AdminCategoryPage'
import AdminSideBar from './components/AdminSideBar/AdminSideBar'
import AdminLayout from './layout/AdminLayout'
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

    {/* admin */}
    <Route path="admin" >
      <Route index element={<AdminLoginPage/>}/>
      {/* AdminLayout */}
      <Route element={<AdminLayout/>}>

      <Route path='dashboard'element={<AdminDashboard/>}/>
      <Route path='products' element={<AdminProductPage/>}/>
      <Route path='categories' element={<AdminCategoryPage/>}/>
      <Route path='banner' element={<AdminProductPage/>}/>
      </Route>
      
    </Route>
  </Routes>
  </Suspense>
</Router>
 </>


  
  )
}

export default App
