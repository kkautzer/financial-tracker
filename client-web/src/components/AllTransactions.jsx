import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import FinanceDataContext from '../contexts/FinanceDataContext';
import PageContext from '../contexts/PageContext';
import { useContext } from 'react';
import Transaction from './dashboard-subpages/Transaction';

export default function AllTransactions() {
    const setPage = useContext(PageContext);

    const finData = useContext(FinanceDataContext);
    const categories = finData[0].categories;
    const transactions = finData[0].transactions;

    const categoryIdToName = []
    categories.map((cat) => {
        categoryIdToName[cat['category_id']] = cat['category_name'];
    })


    //// based on the range parameters, update the set of transactions here.

    const pastTransactions = [];
    const upcomingTransactions = [];
    const balanceHistory = [];
    
    transactions.slice().reverse().forEach((trnsc) => {
        let months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        let date = trnsc['transaction_date'].split('T')[0].split('-');
        balanceHistory.push({
            date: months[parseInt(date[1])] + " " +  parseInt(date[2]) + ", " + parseInt(date[0]),
            amt: trnsc['transaction_pbalance']
        });
        new Date(trnsc['transaction_date']) > Date.now() ? upcomingTransactions.push(trnsc) : pastTransactions.push(trnsc);
    });


    console.log(upcomingTransactions);
    console.log(pastTransactions)

    return <div className='m-4'>
        <div className='flex flex-col md:flex-row'>
            <button onClick={() => setPage('dashboard')} className="text-indigo-500 text-lg font-semibold shadow-xs md:basis-1/4 text-center md:text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-800 hover:cursor-pointer">&larr; Back to Dashboard</button>
            <h3 className='md:basis-1/2 font-semibold justify-center text-center text-2xl'>Transactions</h3>
            <div className='md:basis-1/4'></div>
        </div>
        
        <LineChart width={500} height={250} className='mx-auto mt-3' data={balanceHistory}>
            <CartesianGrid/>
            <XAxis dataKey='date'/>
            <YAxis/>
            <Line dataKey="amt" />
            <Tooltip formatter={(val, name, props) => { return "$"+val.toFixed(2)}} />
        </LineChart>
        
        {/* <div className='justify-center text-center'>
            <p>This is a dropdown with selection for accounts</p>
        </div> */}

        <div className='flex flex-col lg:flex-row mx-3 mt-2'>
            <div className='lg:basis-1/2'>
                <h3 className='text-xl xl:text-2xl'>Past Transactions</h3><p>range selection</p>
                {pastTransactions.slice().reverse().map((trnsc) => {
                    return <Transaction key={trnsc['transaction_id']}
                        name={trnsc['transaction_name']}
                        expense={trnsc['transaction_is_expense'] > 0}
                        amount={trnsc['transaction_amt']}
                        pBalance={trnsc['transaction_pbalance']}
                        date={(trnsc['transaction_date'])}
                        frequency={trnsc['transaction_recurrence_period'] == -1 ? "One-time" : trnsc['transaction_recurrence_period']}
                        category={categoryIdToName[trnsc['category_id']]}
                    />
                })}
            </div>
            <div className='lg:basis-1/2 mt-3 lg:mt-0'>
                <h3 className='text-xl xl:text-2xl'>Upcoming Transactions</h3><p>range selection (max. 1yr.)</p>
                {upcomingTransactions.map((trnsc) => {
                    return <Transaction key={trnsc['transaction_id']}
                        name={trnsc['transaction_name']}
                        expense={trnsc['transaction_is_expense'] > 0}
                        amount={trnsc['transaction_amt']}
                        pBalance={trnsc['transaction_pbalance']}
                        date={(trnsc['transaction_date'])}
                        frequency={trnsc['transaction_recurrence_period'] == -1 ? "One-time" : trnsc['transaction_recurrence_period']}
                        category={categoryIdToName[trnsc['category_id']]}
                    />
                })}
            </div>
        </div>
    </div>
}