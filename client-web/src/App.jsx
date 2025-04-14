import { useState, useContext } from 'react'
import { Outlet, useNavigate } from 'react-router';
import './index.css'
import Dashboard from './components/Dashboard.jsx';
import Navbar from './components/Navbar.jsx';

function App() {
  const navigate = useNavigate();
  
  const loginStatus = sessionStorage.getItem('login') || 'false';  

  if (!loginStatus) {
    navigate('/auth/login');
  } else {
    return (
      <>
        <Navbar/>
        <Outlet/>
      </>
    )
  }
  
}

export default App
