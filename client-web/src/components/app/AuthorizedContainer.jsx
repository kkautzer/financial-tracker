import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router';
import Navbar from './NavbarAuthorized.jsx';
import FinanceDataContext from '../../contexts/FinanceDataContext.js';


export default function AuthorizedContainer() {
  const navigate = useNavigate();
  const loginStatus = sessionStorage.getItem('login') || 'false';  

  useEffect(() => {
    if (loginStatus !== 'true') {
      navigate('/auth/login');
    }
  }, [loginStatus])
  
  let [ financeData, setFinanceData ] = useState([]);

  useEffect(() => {
    // get finance data from backend API
    
    let newData = [ // temporary sample data
      {name:"Food", value: 450},
      { name: "Bills", value: 330 },
      { name: "Transport", value: 150 },
      { name: "Entertainment", value: 100 },
      { name: "Savings", value: 2000 },
      { name: "Loans", value: 800},
      { name: "Rent", value: 2121.18}
    ];

    setFinanceData(newData);
  }, [])

  return (
    <FinanceDataContext.Provider value={financeData}>
      <Navbar/>
      <Outlet/>
    </FinanceDataContext.Provider>
  )
}