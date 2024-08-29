import React from 'react'
import AdminSideBar from '../components/AdminSideBar/AdminSideBar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
     <div className="admin-layout flex w-[100%] h-screen">
        <AdminSideBar/>
        <div className="content-area ml-[17%] w-full">
            <Outlet/>
        </div>

     </div>
  )
}

export default AdminLayout