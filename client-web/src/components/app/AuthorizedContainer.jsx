import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router';
import Navbar from './NavbarAuthorized.jsx';
import FinanceDataContext from '../../contexts/FinanceDataContext.js';
import { API_BASE_URL } from '../../constants.js';

export default function AuthorizedContainer() {
  function getNextPeriod(period) {
    let split = period.split('-');
    if (parseInt(split[1]) === 12) {
        split[0] = String(parseInt(split[0]) + 1).padStart(4, '0')
        split[1] = '01';
    } else {
        split[1] = String(parseInt(split[1]) + 1).padStart(2, '0');
    }

    return split.join('-');
  }

  function datetoTDateString(date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const split = date.split('T')[0].split('-');

    return months[split[1]-1] + " " + split[2] + ", " + split[0];
  }

  const navigate = useNavigate();
  const loginStatus = sessionStorage.getItem('login') || 'false';

  useEffect(() => {
    if (loginStatus !== 'true') {
      navigate('/auth/login');
    }
  }, [loginStatus])
  
  let [ financeData, setFinanceData ] = useState([]);
  let [ transactions, setTransactions ] = useState([]);
  let [ categories, setCategories ] = useState([]);

  // get transactions data
  useEffect(() => {
    fetch(`${API_BASE_URL}/transactions`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(async (res) => {
      const status = res.status;
      const data = await res.json();
      if (status === 200) {
        let newData = data.data.map((tr) => {
          let t = {};
          t.id = tr['transaction_id'],
          t.name = tr['transaction_name'];
          t.value = tr['transaction_amt'];
          t.date = datetoTDateString(tr['transaction_date']);
          t.period = (tr['transaction_date'])?.split('-').slice(0,2).join('-');
          t.categoryId = tr['category_id']
          
          return t;
        });

        setTransactions(newData);
      } else {
        console.log("Err. retrieving transactions");
        console.log(status);
        console.log(data);
      }
    });
  }, []);

  // get categories data
  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(async (res) => {
      const status = res.status;
      const data = await res.json();
      if (status === 200) {
        let newData = data.data.map((cat) => {
          let c = {};
          c.id = cat['category_id'],
          c.name = cat['category_name'];
          c.target = cat['category_budget'];
          c.type = cat['category_is_expense'] ? 'expense' : 'income'
          return c;
        });

        setCategories(newData);
      } else {
        console.log("Err. retrieving categories");
        console.log(status);
        console.log(data);
      }
    })
  }, []);


  // set all other data
  const categoryValues = {};
  const categoriesByPeriod = [];
  const incomeExpenseSummary = {};
  useEffect(() => {


    categories.forEach((cat) => {
      categoryValues[`${cat.id}`] = {};
    })

    let minPeriod = '';
    let maxPeriod = (new Date(Date.now()).toISOString().split('-').slice(0,2).join('-'))
    transactions.forEach((trans) => {
      
      if (minPeriod == '' || trans.period < minPeriod) {
        minPeriod = trans.period;
      }
      if (trans.period > maxPeriod) {
        maxPeriod = trans.period;
      }

      // generate values for each category
      if (`${trans.period}` in categoryValues[`${trans.categoryId}`]) {
        categoryValues[`${trans.categoryId}`][`${trans.period}`]  += trans.value;
      } else {
        categoryValues[`${trans.categoryId}`][`${trans.period}`] = trans.value;
      }
    });


    // match each categories with their period and values
    let currPeriod = minPeriod;
    while (currPeriod !== '' && currPeriod <= maxPeriod) {
      categories.forEach((cat) => {
        categoriesByPeriod.push({
          ...cat, 
          period: currPeriod,
          value: categoryValues?.[`${cat.id}`]?.[currPeriod] || 0
        })
      })
      currPeriod = getNextPeriod(currPeriod);
    }




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
  }, [ transactions, categories ] )


  return (
    <FinanceDataContext.Provider value={financeData}>
      <Navbar />
      <Outlet />
    </FinanceDataContext.Provider>
  )
}