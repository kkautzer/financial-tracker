import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { useContext, useState } from 'react';
import FinanceDataContext from '../../contexts/FinanceDataContext';

import TransactionForm from './components/TransactionForm';

export default function Transactions(props) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    function getTransactionsByCategoryId(id) {
        return transData.filter((tr) => String(tr?.categoryId) === String(id))
    }

    function mapWithDefault(array, callback, defaultValue = []) {
        if (array.length < 1) {
            return defaultValue;
        } else {
            return array.map(callback);
        }
    }

    function periodToDateString(period) {
        const split = period.split('-');
        return months[parseInt(split[1]) -1] + " " + split[0];
    }

    function setPreviousPeriod() {
        setPeriod((prev) => {
            let split = prev.split('-');
            if (parseInt(split[1]) === 1) {
                split[0] = String(parseInt(split[0]) - 1).padStart(4, '0')
                split[1] = String(12);
            } else {
                split[1] = String(parseInt(split[1]) - 1).padStart(2, '0');
            }

            return split.join('-');
        })
    }

    function setNextPeriod() {
        setPeriod((prev) => {
            let split = prev.split('-');
            if (parseInt(split[1]) === 12) {
                split[0] = String(parseInt(split[0]) + 1).padStart(4, '0')
                split[1] = '01';
            } else {
                split[1] = String(parseInt(split[1]) + 1).padStart(2, '0');
            }

            return split.join('-');
        })
    }

    const currentPeriod = (new Date(Date.now()).toISOString().split('-').slice(0,2).join('-'));
    const [ period, setPeriod ] = useState(currentPeriod); 
    const finData = useContext(FinanceDataContext)
    const catData = finData.categories || [];
    const transData = finData.transactions || [];
    const sumData = finData.incomeExpenseSummary || [];

    catData.sort((a,b) => {
        if (Math.abs(a.value) > Math.abs(b.value)) {
            return -1;
        } else if (Math.abs(a.value) < Math.abs(b.value)) {
            return 1;
        } else {
            return 0;
        }
    });

    transData.sort((a,b) => { // sort by category id, then by date, then by transaction amount
        if (a.categoryId > b.categoryId) {
            return 1;
        } else if (a.categoryId < b.categoryId) {
            return -1;
        } else if (a.date > b.date) {
            return 1;
        } else if (a.date < b.date) {
            return -1;
        } else if (Math.abs(a.value)  > Math.abs(b.value)) {
            return 1;
        } else if (Math.abs(a.value) < Math.abs(b.value)) {
            return -1;
        } else {
            return 0;
        }
    });

    const incomeExpenseSummaryData = Object.keys(sumData).filter((sumPeriod) => sumPeriod <= period).sort().map((period) => {
        let nd = {};
        nd.period = period;
        nd.incomes = sumData[period].incomes;
        nd.expenses = Math.abs(sumData[period].expenses);
        nd.periodString = periodToDateString(period)
        return nd;
    });

    const incomeData = catData.filter((item) => item.type==="income" && item.period === period);
    const expenseData = catData.filter((item) => item.type==="expense" && item.period === period);
    const totalIncome = incomeData.reduce((sum, item) => sum + item.value, 0)
    const totalExpenses = expenseData.reduce((sum, item) => sum + item.value, 0)

    return <div className='my-4 mx-15'>
        <div className='text-xl sm:flex align-middle'>
            <div className='sm:basis-1/4 text-center'><button disabled={incomeExpenseSummaryData.length === 1} onClick={setPreviousPeriod} className='btn btn-primary'>Previous</button></div>
            <div className='sm:basis-1/2 text-center my-auto'><strong>{periodToDateString(period)}</strong></div>
            <div className='sm:basis-1/4 text-center'><button disabled={period === currentPeriod} onClick={setNextPeriod} className='btn btn-primary'>Next</button></div>
        </div>

        <div className='mt-4'>
            <ResponsiveContainer width='100%' style={{aspectRatio: '4/1'}}>
                <BarChart 
                    width={500} height={300}
                    data={incomeExpenseSummaryData.slice(Math.max(incomeExpenseSummaryData.length-6, 0), incomeExpenseSummaryData.length)}
                    margin={{top: 5, right: 30, left: 20, bottom: 5}}
                >
                    <CartesianGrid strokeDashArray="3 3" />
                    <XAxis dataKey="periodString" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="incomes" fill='#7762c7' />
                    <Bar dataKey="expenses" fill='#444444' />
                </BarChart>
            </ResponsiveContainer>
        </div>

        <div className='mt-4'>
            <h2 className='text-3xl'>Incomes</h2>
            <div className='ml-3 mt-3'>
                { (incomeData.length > 0)
                ?
                incomeData.map((item) => {
                    return <div key={item.id} className='collapse collapse-arrow bg-base-100  border-base-300 border rounded-none border-x-0'>
                        <input type='checkbox' className='peer' id={`expandCheckbox${item.id}`}/>
                        <p className='collapse-title peer-checked:border-b-2 peer-checked:border-base-300'>
                            <span className='text-2xl font-semibold'>{item.name}</span>
                            <br/>
                            <span className='text-lg mt-1'>${Math.abs(item.value).toFixed(2)} | {(100*item.value / totalIncome).toFixed(2)}% of total income</span>
                        </p>
                        <div className='collapse-content peer-checked:pt-2 peer-checked:bg-base-200 peer-checked:border-t-0'>
                            <ul>
                                {
                                    mapWithDefault(
                                        getTransactionsByCategoryId(item.id).filter((tr) => tr.period === period),
                                        (trans) => {
                                            return <li key={trans.id} className='mb-3'>
                                                <span className='text-lg m-0'>{trans.name}: ${Math.abs(trans.value).toFixed(2)}</span>
                                                <br/>
                                                <span className='text-lg text-gray-600'>{trans.date} | {Math.abs(100*trans.value / item.value).toFixed(2)}% of total {item.name}</span>
                                            </li>
                                        },
                                        <li className='text-lg text-red-700'>No {item.name} Transactions. Add one using the button below!</li>
                                    )
                                }
                            </ul>
                            <button className='btn btn-primary w-1/1 mt-4' onClick={() => document.getElementById(`incomesModal${item.id}`).showModal()}>+ Add Income</button>
                            <TransactionForm presetId={item.id} catData={incomeData} modalId={`incomesModal${item.id}`} isIncome={true}/>
                        </div>
                    </div>
                })
                : 
                <p>No incomes for this period!</p>
                }
            </div>
        </div>
        <div className='mt-4'>
            <h2 className='text-3xl'>Expenses</h2>
            <div className='ml-3 mt-3'>
                { (expenseData.length > 0)
                ?
                expenseData.map((item) => {
                    return <div key={item.id} className='collapse collapse-arrow border-base-300 border rounded-none border-x-0'>
                        <input type='checkbox' className='peer' id={`expandCheckbox${item.id}`}/>
                        <p className='collapse-title'>
                            <span className='text-2xl font-semibold'>{item.name}</span>
                            <br/>
                            <span className='text-lg mt-1'>${Math.abs(item.value).toFixed(2)} | {(100*item.value / totalExpenses).toFixed(2)}% of total expenses</span>
                        </p>
                        <div className='collapse-content peer-checked:pt-2 peer-checked:bg-base-200 peer-checked:border-t-0'>
                            <ul>
                                {
                                    mapWithDefault(
                                        getTransactionsByCategoryId(item.id).filter((tr) => tr.period === period),
                                        (trans) => {
                                            return <li key={trans.id} className='mb-3'>
                                                <span className='text-lg m-0'>{trans.name}: ${Math.abs(trans.value).toFixed(2)}</span>
                                                <br/>
                                                <span className='text-lg text-gray-600'>{trans.date} | {Math.abs(100*trans.value / item.value).toFixed(2)}% of total {item.name}</span>
                                            </li>
                                        },
                                        <li className='text-lg text-red-700'>No {item.name} Transactions. Add one using the button below!</li>
                                    )
                                }
                            </ul>
                            <button className='btn btn-primary w-1/1 mt-4' onClick={() => document.getElementById(`expensesModal${item.id}`).showModal()}>+ Add Expense</button>
                            <TransactionForm presetId={item.id} catData={expenseData} modalId={`expensesModal${item.id}`}/>
                        </div>
                    </div>
                })
                : 
                <p>No expenses for this period!</p>
                }
            </div>
        </div>
    </div>
}