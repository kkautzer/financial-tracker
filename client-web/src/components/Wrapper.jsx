import { useState } from 'react';
import PageContext from '../contexts/PageContext';

import Dashboard from './Dashboard';
import AllTransactions from './AllTransactions';
import IncomeSummary from './IncomeSummary';
import ExpenseSummary from './ExpensesSummary';


//// eventually, transform this class into using `react-router`, rather than Context
export default function Wrapper() {
    const [ page, setPage ] = useState('dashboard');

    switch(page) {
        case 'dashboard':
            return <PageContext.Provider value={setPage}><Dashboard/></PageContext.Provider>
        case 'transactions':
            return <PageContext.Provider value={setPage}><AllTransactions/></PageContext.Provider> 
        case 'incomes':
            return <PageContext.Provider value={setPage}><IncomeSummary/></PageContext.Provider>
        case 'expenses':
            return <PageContext.Provider value={setPage}><ExpenseSummary/></PageContext.Provider>
        default:
            return <h2 className='text-xl'>404 - Page not found!!</h2>
    }

}