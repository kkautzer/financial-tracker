import { useState, useContext } from 'react'

import './styles/App.css'
import Wrapper from './components/Wrapper.jsx';
import LoginRegistration from './components/LoginRegistration.jsx';

function App() {
  const [ loginStatus, setLoginStatus ] = useState(sessionStorage.getItem("loginStatus") || "false");
  const updateLoginStatus = (newLoginStatus) => {
    sessionStorage.setItem('loginStatus', newLoginStatus)
    setLoginStatus(newLoginStatus);
  }
  return (
    <>
      {((JSON.parse(loginStatus)) ? <Wrapper/> : <LoginRegistration setLogin={() => updateLoginStatus(true)}/>)}
      {/* {((JSON.parse(loginStatus)) ? <AllTransactions/> : <LoginRegistration setLogin={() => updateLoginStatus(true)}/>)} */}
    </>
  )
}

export default App
