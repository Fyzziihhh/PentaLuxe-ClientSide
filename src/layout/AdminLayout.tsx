
import AdminSideBar from '../components/AdminSideBar/AdminSideBar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
     <div className="admin-layout flex w-[100%] ">
      
        <AdminSideBar/>
      
        <div className="content-area ml-[17%] w-full h-screen">
            <Outlet/>
        </div>

     </div>
  )
}

export default AdminLayout