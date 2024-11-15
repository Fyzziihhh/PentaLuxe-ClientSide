
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
interface IStateUser{
    user:{
        user:boolean|null
    }
}
const UserProtectedRoutes = () => {
    const user = useSelector((state:IStateUser)=>state.user.user)
  return (
    user ? <Outlet/> : <Navigate to='/'/>
  )
}

export default UserProtectedRoutes