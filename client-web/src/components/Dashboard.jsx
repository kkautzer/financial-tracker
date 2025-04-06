import { useContext, useEffect, useState } from 'react';
import DashboardTransactionRecap from './dashboard-subpages/DashboardTransactionRecap';
import DashboardIncomeExpenseReports from './dashboard-subpages/DashboardIncomeExpenseReports';
import FinanceDataContext from '../contexts/FinanceDataContext';

export default function Dashboard(props) {

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

    return <FinanceDataContext.Provider value={[financeData, setFinanceData]}>
        <div className='text-gray-800 m-6'>
            <div className='flex justify-center mb-4'>
                <h1 className='text-2xl md:text-3xl lg:text-3xl xl:text-4xl'>MyFinanceTracker Dashboard</h1>
            </div>
            <div className='flex flex-col md:flex-row'>
                <div className='md:basis-3/4 lg:basis-1/2 mr-3'>
                    <DashboardTransactionRecap/>
                </div>
                <div className='md:basis-1/4 lg:basis-1/2 ml-3 mt-4 md:mt-0'>
                    <DashboardIncomeExpenseReports/>
                </div>
            </div>

        </div>
    </FinanceDataContext.Provider>
}