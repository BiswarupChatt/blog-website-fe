import './App.css';
import Header from './component/Header';
import { Route, Routes } from 'react-router-dom';
import Home from './component/Home';
import Register from './component/Register';
import Login from './component/Login';
import Footer from './component/Footer';
import MyPost from './component/MyPost';
import MyAccount from './component/MyAccount';
import CreatePost from './component/CreatePost';
import SinglePost from './component/SinglePost';
import EditPost from './component/EditPost';
import { PrivateRoute, RedirectedToMain } from './component/Route';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import axios from './config/Axios';

export default function App() {

  const { handleLogin } = useAuth()

  useEffect(() => {

    const token = localStorage.getItem('token')

    if (token) {
      (async () => {
        try {
          const userResponse = await axios.get('/api/users/profile', {
            headers: {
              Authorization: localStorage.getItem('token')
            }
          })
          handleLogin(userResponse.data)
        } catch (err) {

        }
      })();
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

        <Route path='/api/posts/:id' element={<SinglePost />} />

        <Route path='/create-post' element={
          <PrivateRoute>
            <CreatePost />
          </PrivateRoute>} />
        
        <Route path='/api/posts/:id/update' element={
          <PrivateRoute>
            <EditPost />
          </PrivateRoute>} />

      </Routes>

      <Footer />
    </>
  )
}
