import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

import App from './App.jsx';
import Dashboard from './components/Dashboard.jsx';
import Transactions from './components/Transactions.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Budget from './components/Budget.jsx';
import Profile from './components/Profile.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='app?' element={<App />}>
          <Route index path='dashboard?' element={<Dashboard/>}/>
          <Route path='transactions' element={<Transactions/>}/>
          <Route path='budget' element={<Budget/>}/>
          <Route path='profile' element={<Profile/>}/>
        </Route>
        <Route path='auth'>
          <Route path='login' element={<Login/>}/>
          <Route path='register' element={<Register/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
