import { useState, useEffect } from 'react';
import PageContext from '../contexts/PageContext';
import FinanceDataContext from '../contexts/FinanceDataContext';
import Dashboard from './Dashboard';
import AllTransactions from './AllTransactions';
import IncomeSummary from './IncomeSummary';
import ExpenseSummary from './ExpensesSummary';


//// eventually, transform this class into using `react-router`, rather than Context
export default function Wrapper() {

    const [ page, setPage ] = useState('dashboard');
    const [ financeData, setFinanceData ] = useState({
        categories: [],
        transactions: []
    });


    useEffect(() => {
        let categories = [];
        let transactions = [];

        fetch("http://localhost:5555/categories", {
            method: 'GET',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            // TODO account for non-200 OK statuses
            // TODO account for non-200 OK statuses
            // TODO account for non-200 OK statuses
            // TODO account for non-200 OK statuses
            // TODO account for non-200 OK statuses
            return res.json();
        }).then((res) => {
            categories = res.data;
        });

        fetch('http://localhost:5555/transactions', {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            // TODO account for non-200 OK statuses
            // TODO account for non-200 OK statuses
            // TODO account for non-200 OK statuses
            // TODO account for non-200 OK statuses
            // TODO account for non-200 OK statuses
            return res.json();
        }).then((res) => {
            transactions = res.data;
            
            setFinanceData({
                categories: categories,
                transactions: transactions
            });
        });
    }, []);

    switch(page) {
        case 'dashboard':
            return <FinanceDataContext.Provider value={[financeData, setFinanceData]}>
                <PageContext.Provider value={setPage}><Dashboard/></PageContext.Provider>
            </FinanceDataContext.Provider>
        case 'transactions':
            return <FinanceDataContext.Provider value={[financeData, setFinanceData]}>
                <PageContext.Provider value={setPage}><AllTransactions/></PageContext.Provider> 
            </FinanceDataContext.Provider>
        case 'incomes':
            return <FinanceDataContext.Provider value={[financeData, setFinanceData]}>
                <PageContext.Provider value={setPage}><IncomeSummary/></PageContext.Provider>
            </FinanceDataContext.Provider>
        case 'expenses':
            return <FinanceDataContext.Provider value={[financeData, setFinanceData]}>
                <PageContext.Provider value={setPage}><ExpenseSummary/></PageContext.Provider>
            </FinanceDataContext.Provider>
        default:
            return <h2 className='text-xl'>404 - Page not found!!</h2>
    }

}