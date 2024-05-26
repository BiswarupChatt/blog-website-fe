import './App.css';
import Header from './component/Header';
import { Route, Routes } from 'react-router-dom';
import Home from './component/Home';
import Register from './component/Register';
import Login from './component/Login';
import Footer from './component/Footer';
import MyPost from './component/MyPost';
import MyAccount from './component/MyAccount';
import { PrivateRoute, RedirectedToMain } from './component/Route';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import axios from './config/Axios';

export default function App() {

  const { handleLogin } = useAuth()

  useEffect(() => {
    if (localStorage.getItem('token')) {
      (async () => {
        const userResponse = await axios.get('/api/users/profile', {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
        handleLogin(userResponse.data)
      })()
    }
  }, [])

  return (
    <>
      <Header />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={
        <RedirectedToMain>
          <Register />
        </RedirectedToMain>
      } />
        <Route path='/login' element={
          <RedirectedToMain>
            <Login />
          </RedirectedToMain>
        } />
        <Route path='/my-post' element={
          <PrivateRoute>
            <MyPost />
          </PrivateRoute>
        } />
        <Route path='/my-account' element={
          <PrivateRoute>
            <MyAccount />
          </PrivateRoute>} />
      </Routes>

      <Footer />
    </>
  )
}
