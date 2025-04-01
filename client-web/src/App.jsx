import { useState, useContext } from 'react'
import './styles/App.css'
import Dashboard from './components/Dashboard.jsx';
import LoginRegistration from './components/LoginRegistration.jsx';

function App() {
  const [ loginStatus, setLoginStatus ] = useState(sessionStorage.getItem("loginStatus") || "false");
  {console.log(loginStatus)}
  const updateLoginStatus = (newLoginStatus) => {
    sessionStorage.setItem('loginStatus', newLoginStatus)
    setLoginStatus(newLoginStatus);
  }
  return (
    <>
      {((JSON.parse(loginStatus)) ? <Dashboard/> : <LoginRegistration setLogin={() => updateLoginStatus(true)}/>)}
    </>
  )
}

export default App
