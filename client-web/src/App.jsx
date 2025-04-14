import { Routes, Route } from 'react-router';
import './index.css'

import AuthorizedContainer from './components/app/AuthorizedContainer.jsx'
import LoginContainer from './components/public/UnauthorizedContainer.jsx';
import Dashboard from './components/app/Dashboard.jsx';
import Transactions from './components/app/Transactions.jsx';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import Budget from './components/app/Budget.jsx';
import Profile from './components/app/Profile.jsx';
import Settings from './components/app/Settings.jsx';
import Logout from './components/auth/Logout.jsx';
import PageNotFound from './components/PageNotFound.jsx';
import Home from './components/public/Home.jsx';
import About from './components/public/About.jsx';


function App() {
  return <Routes>
    <Route path='app' element={<AuthorizedContainer />}>
      <Route index path='dashboard?' element={<Dashboard/>}/>
      <Route path='transactions' element={<Transactions/>}/>
      <Route path='budget' element={<Budget/>}/>
      <Route path='profile' element={<Profile/>}/>
      <Route path='settings' element={<Settings/>}/>
      <Route path='logout' element={<Logout/>} />
      <Route path='*' element={<PageNotFound/>} />
    </Route>
    <Route path='/' element={<LoginContainer />}>
      <Route path='home?' index element={<Home/>} />
      <Route path='about' element={<About/>} />
      <Route path='auth?/login' element={<Login/>}/>
      <Route path='auth?/register' element={<Register/>}/>
    </Route>
    <Route path='*' element={<PageNotFound />} />
  </Routes>
  
}

export default App
