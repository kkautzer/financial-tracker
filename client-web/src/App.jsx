import { useState, useContext } from 'react'
import './styles/App.css'
import Dashboard from './components/Dashboard.jsx';
import LoginRegistration from './components/LoginRegistration.jsx';
import AllTransactions from './components/AllTransactions.jsx';

function App() {
  const [ loginStatus, setLoginStatus ] = useState(sessionStorage.getItem("loginStatus") || "false");
  const updateLoginStatus = (newLoginStatus) => {
    sessionStorage.setItem('loginStatus', newLoginStatus)
    setLoginStatus(newLoginStatus);
  }
  return (
    <>
      {((JSON.parse(loginStatus)) ? <Dashboard/> : <LoginRegistration setLogin={() => updateLoginStatus(true)}/>)}
      {/* {((JSON.parse(loginStatus)) ? <AllTransactions/> : <LoginRegistration setLogin={() => updateLoginStatus(true)}/>)} */}
    </>
  )
}

export default App
