import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export function PrivateRoute({ children }) {
    const { user } = useAuth()
    const location = useLocation()

    if (!user && localStorage.getItem('token')) {
        return <p>Loading...</p>
    }

    if (!user) {
        return (<Navigate to='/login' state={{ from: location }} />)
    }

    else {
        return children
    }
}

export function RedirectedToMain({ children }) {
    const { user } = useAuth()
    const location = useLocation

    if (user) {
        const redirect = location.state?.from?.pathname || '/'
        toast("You're already logged in")
        return <Navigate to={redirect} replace />
    } else {
        return children
    }
}