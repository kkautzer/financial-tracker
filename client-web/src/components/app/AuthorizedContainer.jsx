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
      incomeExpenseSummary: [
        {period: '2024-09', incomes: 6251.18, expenses: -4022.98},
        {period: '2024-10', incomes: 6251.18, expenses: -4670.41},
        {period: '2024-11', incomes: 6251.18, expenses: -4049.63},
        {period: '2024-12', incomes: 6251.18, expenses: -4886.12},
        {period: '2025-01', incomes: 6251.18, expenses: -4395.55},
        {period: '2025-02', incomes: 6251.18, expenses: -5160.26},
        {period: '2025-03', incomes: 6251.18, expenses: -4815.03},
        {period: '2025-04', incomes: 6251.18, expenses: -5951.18},
        {period: '2025-05', incomes: 6251.18, expenses: -4022.98},
      ],
      categories: [ // temporary sample data
        { id: '0', period: '2025-05', name: "Salary", value: 6251.18, target: 6300, type: "income" },
        { id: '1', period: '2025-05', name:"Food", value: -450, target: -500, type: "expense" },
        { id: '2', period: '2025-05', name: "Bills", value: -330, target: -450, type: "expense" },
        { id: '3', period: '2025-05', name: "Transport", value: -150, target: -200, type: "expense" },
        { id: '4', period: '2025-05', name: "Entertainment", value: -100, target: -100, type: "expense" },
        { id: '5', period: '2025-05', name: "Savings", value: -2000, target: -2500, type: "expense" },
        { id: '6', period: '2025-05', name: "Loans", value: -800, target: -1000, type: "expense" },
        { id: '7', period: '2025-05', name: "Rent", value: -2121.18, target: -2200, type: "expense" }
      ],
      transactions: [
        { id: '100', period: '2025-05', name: "Car Loan", value: -200, date: "May 5, 2025", categoryId: '6'},
        { id: '101', period: '2025-05', name: "Student Loan", value: -600, date: "May 1, 2025", categoryId: '6'},
        { id: '102', period: '2025-05', name: "Netflix Subscription", value: -20, date: "April 30, 2025", categoryId: '4'},
      ]
    }
    setFinanceData(newData);
  }, [])

  return (
    <FinanceDataContext.Provider value={financeData}>
      <Navbar />
      <Outlet/>
    </FinanceDataContext.Provider>
  )
}