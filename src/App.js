import './App.css';
import Header from './component/Header';
import { Route, Routes } from 'react-router-dom';
import Home from './component/Home';
import Register from './component/Register';
import Login from './component/Login';
import Footer from './component/Footer';
import MyPost from './component/MyPost';
import MyAccount from './component/MyAccount';

export default function App() {
  return (
    <>
      <Header />
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/my-post' element={<MyPost/>}/>
        <Route path='/my-account' element={<MyAccount/>}/>
      </Routes>
      
      <Footer />
    </>
  )
}
