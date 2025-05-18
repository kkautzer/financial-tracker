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
    
    let newData = {
      categories: [ // temporary sample data
        { id: '0', name: "Salary", value: 6251.18, type: "income" },
        { id: '1', name:"Food", value: -450, type: "expense" },
        { id: '2', name: "Bills", value: -330, type: "expense" },
        { id: '3', name: "Transport", value: -150, type: "expense" },
        { id: '4', name: "Entertainment", value: -100, type: "expense" },
        { id: '5', name: "Savings", value: -2000, type: "expense" },
        { id: '6', name: "Loans", value: -800, type: "expense" },
        { id: '7', name: "Rent", value: -2121.18, type: "expense" }
      ],
      transactions: [
        { id: '100', name: "Car Loan", value: -200, date: "May 5, 2025", categoryId: '6'},
        { id: '101', name: "Student Loan", value: -600, date: "May 1, 2025", categoryId: '6'},
        { id: '102', name: "Netflix Subscription", value: -20, date: "April 30, 2025", categoryId: '4'},
      ]
    }
    setFinanceData(newData);
  }, [])

  return (
    <FinanceDataContext.Provider value={financeData}>
      <Navbar/>
      <Outlet/>
    </FinanceDataContext.Provider>
  )
}