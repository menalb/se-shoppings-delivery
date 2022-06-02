import { Navigate, Outlet, Route, } from "react-router-dom"
import { useAuth } from "../context/AuthContext";

export const PublicRoutes = (props: any) => {

    const auth = useAuth()

    if (!!(auth.currentUser)) {
        return auth.roles.some(r => r === 'operator') ? <Navigate to="/customers" /> : <Navigate to="/no-auth" />;
    }    

    return <Outlet />
}

export const ProtectedRoutes = (props: any) => {
    const auth = useAuth()

    const canAccess = !!(auth.currentUser) && auth.roles.some(r => r === 'operator');

    return canAccess ? <Outlet /> : <Navigate to="/login" />
}

export const AdminRoutes = (props: any) => {

    const auth = useAuth()

    const canAccess = !!(auth.currentUser) && auth.roles.some(r => r === 'admin');

    return canAccess ? <Outlet /> : <Navigate to="/login" />
}
