import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { useContext } from 'react';
import FinanceDataContext from '../../contexts/FinanceDataContext';

import TransactionForm from './components/TransactionForm';


export default function Transactions() {
    const finData = useContext(FinanceDataContext).sort((a,b) => {
        if (Math.abs(a.value) > Math.abs(b.value)) {
            return -1;
        } else if (Math.abs(a.value) < Math.abs(b.value)) {
            return 1;
        } else {
            return 0;
        }
    });

    function handleAddTransaction(e) {
        alert("Adding task!!")
    }

    const incomeData = finData.filter((item) => item.type==="income");
    const expenseData = finData.filter((item) => item.type==="expense");
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
            <div className='ml-3'>
                {incomeData.map((item) => {
                    return <div key={item.name} className='collapse collapse-arrow bg-base-100 border-base-300 border my-2'>
                        <input type='checkbox' className='peer'/>
                        <p className='collapse-title peer-checked:border-b-2 peer-checked:border-base-300'>
                            <span className='text-2xl font-semibold'>{item.name}</span>
                            <br/>
                            <span className='text-lg mt-1'>${Math.abs(item.value).toFixed(2)} | {(100*item.value / totalIncome).toFixed(2)}% of total income</span>
                        </p>
                        <div className='collapse-content'>
                            <p className='text-lg mt-2'>// this should be a list of {item.name} incomes for the currently selected period!</p>
                            <button className='btn btn-primary w-1/1 mt-4' onClick={() => document.getElementById('incomesModal').showModal()}>+ Add Income</button>
                            <TransactionForm modalId='incomesModal' isIncome={true} handleSubmission={handleAddTransaction}/>
                        </div>
                    </div>
                })}
            </div>
        </div>
        <div className='mt-4'>
            <h2 className='text-3xl'>Expenses</h2>
            <div className='ml-3'>
                {expenseData.map((item) => {
                    return <div key={item.name} className='collapse collapse-arrow bg-base-100 border-base-300 border my-2'>
                        <input type='checkbox' className='peer'/>
                        <p className='collapse-title peer-checked:border-b-2 peer-checked:border-base-300'>
                            <span className='text-2xl font-semibold'>{item.name}</span>
                            <br/>
                            <span className='text-lg mt-1'>${Math.abs(item.value).toFixed(2)} | {(100*item.value / totalExpenses).toFixed(2)}% of total expenses</span>
                        </p>
                        <div className='collapse-content'>
                            <p className='text-lg mt-2'>// this should be a list of {item.name} expenses for the currently selected period!</p>
                            <button className='btn btn-primary w-1/1 mt-4' onClick={() => document.getElementById('expensesModal').showModal()}>+ Add Expense</button>
                            <TransactionForm modalId='expensesModal' handleSubmission={handleAddTransaction}/>
                        </div>
                    </div>
                })}
            </div>
        </div>
    </div>
}