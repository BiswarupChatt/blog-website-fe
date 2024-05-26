import './App.css';
import Header from './component/Header';
import { Route, Routes } from 'react-router-dom';
import Home from './component/Home';
import Register from './component/Register';
import Login from './component/Login';
import Footer from './component/Footer';
import MyPost from './component/MyPost';
import MyAccount from './component/MyAccount';
import { PrivateRoute } from './component/Route';

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
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
