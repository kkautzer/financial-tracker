import { useState, useContext } from 'react'
import Transaction from "./Transaction";
import FinanceDataContext from '../contexts/FinanceDataContext';

export default function DashboardTransactionRecap(props) {
    function date_stringify(date) {
        date = date.split('T')[0];
        date = date.split('-');
        const months = [ "January", "February", "March", "April", "May", "June", "July", "September", "October", "November", "December"];

        return months[parseInt(date[1]-1)] + ' ' + parseInt(date[2]) + ', ' + parseInt(date[0]);
    }

    function withinNext30Days(date) {
        return date > Date.now() && Math.abs(Date.now() - date) < 30*24*60*60*1000
    }

    function withinPast30Days(date) {
        return Date.now() > date && Math.abs(Date.now() - date) < 30*24*60*60*1000
    }



    const financeDataContext = useContext(FinanceDataContext);

    let categories = financeDataContext[0].categories;
    let transactions = financeDataContext[0].transactions;
    let categoryIdToName = {};

    categories.forEach((cat) => {
        categoryIdToName[cat.category_id] = cat.category_name;
    });

    let upcomingTransactions = transactions.filter((trnsc) => {
        return withinNext30Days(new Date(trnsc['transaction_date']));
    });
    let pastTransactions = transactions.filter((trnsc) => {
        return withinPast30Days(new Date(trnsc['transaction_date']));
    })

    return <div>
        <h2 className='text-2xl md:text-3xl xl:text-4xl mb-3 text-center'>Transactions</h2>
        {/* filter data from context based on the selected accounts */}
        <h3 className='text-xl md:text-2xl xl:text-3xl'>Upcoming Transactions</h3>

        <div>
            {upcomingTransactions.length > 0 ? 
                upcomingTransactions.map((trnsc) => {
                    return <Transaction key={trnsc['transaction_id']}
                        name={trnsc['transaction_name']}
                        expense={trnsc['transaction_is_expense'] > 0}
                        amount={trnsc['transaction_amt']}
                        pBalance={300}
                        date={date_stringify(trnsc['transaction_date'])}
                        frequency={trnsc['transaction_recurrence_period'] == -1 ? "One-time" : trnsc['transaction_recurrence_period']}
                        category={categoryIdToName[trnsc['category_id']]}
                    />
                })
            :
                <p className='text-md ml-4 italic'>No Upcoming Transactions!</p>
            }
        </div>

        <h3 className='mt-3 text-xl md:text-2xl xl:text-3xl'>Recent Transactions</h3>
            {pastTransactions.length > 0 ? 
                pastTransactions.map((trnsc) => {
                    return <Transaction key={trnsc['transaction_id']}
                        name={trnsc['transaction_name']}
                        expense={trnsc['transaction_is_expense'] > 0}
                        amount={trnsc['transaction_amt']}
                        pBalance={300}
                        date={date_stringify(trnsc['transaction_date'])}
                        frequency={trnsc['transaction_recurrence_period'] == -1 ? "One-time" : trnsc['transaction_reccurence_period']}
                        category={categoryIdToName[trnsc['category_id']]}
                    />
                })
            :
                <p className='text-md ml-4 italic'>No Past Transactions!</p>
            }
            



        <button className='ex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover:cursor-pointer mt-3'>View All Transactions</button>

    </div>
}