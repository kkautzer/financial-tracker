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
    const transactions = [ // sample transactions from api
      { id: '78', period: '2025-05', name: "Salary", value: 6200, date: "May 2, 2025", categoryId: '0'},
      { id: '100', period: '2025-05', name: "Car Loan", value: -500, date: "May 5, 2025", categoryId: '6'},
      { id: '101', period: '2025-05', name: "Student Loan", value: -600, date: "May 1, 2025", categoryId: '6'},
      { id: '102', period: '2025-05', name: "Netflix Subscription", value: -20, date: "May 11, 2025", categoryId: '4'},
      { id: '102', period: '2025-05', name: "Rent Payment", value: -2128.18, date: "May 22, 2025", categoryId: '7'},
      { id: '79', period: '2025-04', name: "Salary", value: 6200, date: "April 2, 2025", categoryId: '0'},
      { id: '104', period: '2025-04', name: "Rent Payment", value: -2128.18, date: "April 22, 2025", categoryId: '7'},

    ];

    let categories = [ // sample categories from api
      { id: '0', name: "Salary", target: 6300, type: "income" },
      { id: '1', name:"Food", target: -500, type: "expense" },
      { id: '2', name: "Bills", target: -450, type: "expense" },
      { id: '3', name: "Transport", target: -200, type: "expense" },
      { id: '4', name: "Entertainment", target: -100, type: "expense" },
      { id: '5', name: "Savings",  target: -2500, type: "expense" },
      { id: '6', name: "Loans",  target: -1000, type: "expense" },
      { id: '7', name: "Rent", target: -2200, type: "expense" }
    ];

    const categoryValues = {};
    transactions.forEach((trans) => {
      // generate values for each category
      if (`${trans.categoryId}` in categoryValues && `${trans.period}` in categoryValues[`${trans.categoryId}`]) {
        categoryValues[`${trans.categoryId}`][`${trans.period}`]  += trans.value;
      } else {
        if (!(`${trans.categoryId}` in categoryValues)) {
          categoryValues[`${trans.categoryId}`] = {};
        }
        categoryValues[`${trans.categoryId}`][`${trans.period}`] = trans.value;
        
      }
    });

    /// match each categories with their period and values
    const categoriesByPeriod = [];
    categories.forEach((cat) => {
      if (`${cat.id}` in categoryValues) {
        for (let period in categoryValues[`${cat.id}`]) {
          categoriesByPeriod.push({
            ...cat,
            period: period,
            value: categoryValues[`${cat.id}`][period]
          });
        }
      }
    });

    const incomeExpenseSummary = {};
    categoriesByPeriod.forEach((cat) => {
      if (!(cat.period in incomeExpenseSummary)) {
        incomeExpenseSummary[cat.period] = {incomes: 0, expenses: 0};
      }
      if (cat.type === 'income') {
        incomeExpenseSummary[cat.period].incomes += cat.value;
      } else if (cat.type === 'expense') {
        incomeExpenseSummary[cat.period].expenses += cat.value;
      }
    });

    let newData = {
      incomeExpenseSummary: incomeExpenseSummary,
      categories: categoriesByPeriod,
      transactions: transactions
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