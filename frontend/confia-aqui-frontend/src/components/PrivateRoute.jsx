import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function PrivateRoute({children, role}) {
    const {user} = useAuth()

    if(!user) return <Navigate to="/login"/>

    if (role) {
        const userRole = user.role ? user.role.replace(/^ROLE_/, '') : ''
        const requiredRole = role ? role.replace(/^ROLE_/, '') : ''
        if (userRole !== requiredRole) return <Navigate to="/home" />
    }

    return children
}

export default PrivateRoute