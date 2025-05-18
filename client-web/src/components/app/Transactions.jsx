import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { useContext } from 'react';
import FinanceDataContext from '../../contexts/FinanceDataContext';

import TransactionForm from './components/TransactionForm';


export default function Transactions() {
    function getTransactionsByCategoryId(id) {
        return transData.filter((tr) => String(tr?.categoryId) === String(id))
    }

    function mapWithDefault(array, callback, defaultValue = []) {
        console.log(array)
        if (array.length < 1) {
            return defaultValue;
        } else {
            return array.map(callback);
        }
    }

    const finData = useContext(FinanceDataContext)
    const catData = finData.categories || [];
    const transData = finData.transactions || [];

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

    console.log(transData)

    function handleAddTransaction(e) {
        alert("Adding transaction!!")
    }

    const incomeData = catData.filter((item) => item.type==="income");
    const expenseData = catData.filter((item) => item.type==="expense");
    const totalIncome = incomeData.reduce((sum, item) => sum + item.value, 0)
    const totalExpenses = expenseData.reduce((sum, item) => sum + item.value, 0)

    return <div className='my-4 mx-15'>
        <div>
            {/* this should be a double bar graph, with a comparison of monthly income vs expenses*/}
        </div>

        <div className='text-xl flex align-middle'>
            <div className='basis-1/4 text-center'><button className='btn btn-primary'>Previous</button></div>
            <div className='basis-1/2 text-center my-auto'><p className='align-middle'>Select Period</p></div>
            <div className='basis-1/4 text-center'><button className='btn btn-primary'>Next</button></div>
        </div>

        <div className='mt-4'>
            <h2 className='text-3xl'>Incomes</h2>
            <div className='ml-3 mt-3'>
                {incomeData.map((item) => {
                    return <div key={item.name} className='collapse collapse-arrow bg-base-100 border-base-300 border rounded-none border-x-0'>
                        <input type='checkbox' className='peer'/>
                        <p className='collapse-title peer-checked:border-b-2 peer-checked:border-base-300'>
                            <span className='text-2xl font-semibold'>{item.name}</span>
                            <br/>
                            <span className='text-lg mt-1'>${Math.abs(item.value).toFixed(2)} | {(100*item.value / totalIncome).toFixed(2)}% of total income</span>
                        </p>
                        <div className='collapse-content peer-checked:pt-2 peer-checked:bg-base-200 peer-checked:border-t-0'>
                            <ul>
                                {
                                    mapWithDefault(
                                        getTransactionsByCategoryId(item.id),
                                        (trans) => {
                                            return <li className='mb-3'>
                                                <span className='text-lg m-0'>{trans.name}: ${Math.abs(trans.value).toFixed(2)}</span>
                                                <br/>
                                                <span className='text-lg text-gray-600'>{trans.date} | {Math.abs(100*trans.value / item.value).toFixed(2)}% of total {item.name}</span>
                                            </li>
                                        },
                                        <li className='text-lg text-red-700'>No {item.name} Transactions. Add one using the button below!</li>
                                    )
                                }
                            </ul>
                            <button className='btn btn-primary w-1/1 mt-4' onClick={() => document.getElementById('incomesModal').showModal()}>+ Add Income</button>
                            <TransactionForm modalId='incomesModal' isIncome={true} handleSubmission={handleAddTransaction}/>
                        </div>
                    </div>
                })}
            </div>
        </div>
        <div className='mt-4'>
            <h2 className='text-3xl'>Expenses</h2>
            <div className='ml-3 mt-3'>
                {expenseData.map((item) => {
                    return <div key={item.name} className='collapse collapse-arrow bg-base-100 border-base-300 border rounded-none border-x-0'>
                        <input type='checkbox' className='peer'/>
                        <p className='collapse-title pdeer-checked:bg-base-200'>
                            <span className='text-2xl font-semibold'>{item.name}</span>
                            <br/>
                            <span className='text-lg mt-1'>${Math.abs(item.value).toFixed(2)} | {(100*item.value / totalExpenses).toFixed(2)}% of total expenses</span>
                        </p>
                        <div className='collapse-content peer-checked:pt-2 pgeer-checked:bg-base-200 peer-checked:border-t-0'>
                            <ul>
                                {
                                    mapWithDefault(
                                        getTransactionsByCategoryId(item.id),
                                        (trans) => {
                                            return <li className='mb-3'>
                                                <span className='text-lg m-0'>{trans.name}: ${Math.abs(trans.value).toFixed(2)}</span>
                                                <br/>
                                                <span className='text-lg text-gray-600'>{trans.date} | {Math.abs(100*trans.value / item.value).toFixed(2)}% of total {item.name}</span>
                                            </li>
                                        },
                                        <li className='text-lg text-red-700'>No {item.name} Transactions. Add one using the button below!</li>
                                    )
                                }
                            </ul>
                            <button className='btn btn-primary w-1/1 mt-2' onClick={() => document.getElementById('expensesModal').showModal()}>+ Add Expense</button>
                            <TransactionForm modalId='expensesModal' handleSubmission={handleAddTransaction}/>
                        </div>
                    </div>
                })}
            </div>
        </div>
    </div>
}