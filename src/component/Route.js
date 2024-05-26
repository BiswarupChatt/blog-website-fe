import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export function PrivateRoute({ children }) {
    const { user } = useAuth()

    if (!user && localStorage.getItem('token')) {
        return <p>Loading...</p>
    }

    if (!user) {
        return (<Navigate to='/login' />)
    }

    else {
        return children
    }
}