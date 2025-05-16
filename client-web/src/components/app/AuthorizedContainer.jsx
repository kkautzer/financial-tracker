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
      { name: "Salary", value: 6251.18, type: "income" },
      { name:"Food", value: -450, type: "expense" },
      { name: "Bills", value: -330, type: "expense" },
      { name: "Transport", value: -150, type: "expense" },
      { name: "Entertainment", value: -100, type: "expense" },
      { name: "Savings", value: -2000, type: "expense" },
      { name: "Loans", value: -800, type: "expense" },
      { name: "Rent", value: -2121.18, type: "expense" }
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