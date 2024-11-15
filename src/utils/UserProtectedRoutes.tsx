
import { Navigate, Outlet } from 'react-router-dom'
const UserProtectedRoutes = () => {
    const user = localStorage.get("isUser")
  return (
    user ? <Outlet/> : <Navigate to='/'/>
  )
}

export default UserProtectedRoutes