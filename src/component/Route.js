import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export function PrivateRoute({ children }) {
    const { user } = useAuth()
    const location = useLocation()

    if (!user && localStorage.getItem('token')) {
        return <p>Loading...</p>
    }

    if (!user) {
        return (<Navigate to='/login' state={{from: location}} />)
    }

    else {
        return children
    }
}