import * as React from 'react';
import Loader from './Loader';
import { toast, Zoom } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export function PrivateRoute({ children }) {
    const { user } = useAuth()
    const location = useLocation()

    if (!user && localStorage.getItem('token')) {
        return <p style={{ margin: '50px' }}><Loader/></p>
    }

    if (!user) {
        return (<Navigate to='/login' state={{ from: location }} />)
    }

    else {
        return children
    }
}

export function RedirectedToMain({ children }) {

    const toastStyle = {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Zoom,
    }

    const { user } = useAuth()
    const location = useLocation()
    const redirect = location.state?.from?.pathname || '/my-account'

    if (user) {
        toast.error("You're already logged in", toastStyle)
        return <Navigate to={redirect} replace />
    } else {
        return children
    }
}