import { useContext, useEffect, useState } from 'react'
import FinanceDataContext from '../../contexts/FinanceDataContext';
import BudgetModal from './components/BudgetModal';
import CategoryForm from './components/CategoryForm';


export default function Budget() {

    function periodToDateString(period) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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

    function animateAll() {
        Array.from(document.getElementsByClassName('budgetCard')).forEach((card) => {
            card.classList.remove('bg-size-[0%]');
            card.classList.add('bg-size-[100%]');
        })
    }

    const currentPeriod = (new Date(Date.now()).toISOString().split('-').slice(0,2).join('-'));
    const [ period, setPeriod ] = useState(currentPeriod);
    const [ isIncomeSelected, setIncomeSelected ] = useState(true);
    const catData = useContext(FinanceDataContext).categories || [];
    const sumData = useContext(FinanceDataContext).incomeExpenseSummary || [];
    const forcePageUpdate = useContext(FinanceDataContext)?.forceUpdate;
    catData.forEach((item) => {
        item.value = Math.abs(item.value)
        item.target = Math.abs(item.target)
    });

    const sortedExpenseData = catData.filter((item) => item.type === "expense" && item.period === period);
    sortedExpenseData.sort((a,b) => {
        if (a.value > b.value) {
            return -1;
        } else if (a.value < b.value) {
            return 1;
        } else {
            return 0
        }
    });
    
    const sortedIncomeData = catData.filter((item) => item.type === 'income' && item.period === period);
    sortedIncomeData.sort((a,b) => {
        if (a.value > b.value) { return -1; }
        else if (a.value < b.value) { return 1; }
        else { return 0; }
    })   

    useEffect(() => {
        setTimeout(() => {
            animateAll();
        }, 50)
    }, [isIncomeSelected, period])


    return <div className=''>
        <div className='my-4 mx-15'>
            <div className='text-xl flex align-middle'>
                <div className='basis-1/4 text-center'><button disabled={Object.keys(sumData).filter((sumPeriod) => sumPeriod <= period).length <= 1} onClick={setPreviousPeriod} className='btn btn-primary'>Previous</button></div>
                <div className='basis-1/2 text-center my-auto'><strong>{periodToDateString(period)}</strong></div>
                <div className='basis-1/4 text-center'><button disabled={period === currentPeriod} onClick={setNextPeriod} className='btn btn-primary'>Next</button></div>
            </div>
            <div className='mt-4'>
                <p className='text-xl'>Currently Viewing: <button className='font-semibold border-b-1 hover:cursor-pointer hover:border-gray-600 hover:text-gray-600' onClick={() => setIncomeSelected((prev) => !prev)}>{(isIncomeSelected) ? "Income" : "Expenses"}</button></p>
                <p className='text-sm mt-1 text-gray-500'>Click on any category to view more information, modify it, or delete it!</p>
                {
                (isIncomeSelected) ?
                    sortedIncomeData.map((cat) => {
                        let pct = (100 * cat.value / cat.target).toFixed(2)
                        return <div key={cat.id} >
                            <button
                            onClick={() => {document.getElementById(`budgetModal${cat.id}`).showModal()}}
                            className='budgetCard w-full card border-2 m-3 bg-base-200 border-gray-500 hover:border-3 bg-no-repeat transition duration-1000 bg-size-[0%] transition-[background-size] hover:cursor-pointer' 
                            style={{ backgroundImage: `linear-gradient(to right,rgb(113, 123, 231) ${pct}%, transparent ${pct}%)`}}
                            >
                                <div className='card-body p-3'>
                                    <h2 className='card-title text-2xl text-left'>{cat.name}</h2>
                                    <p className='text-lg text-left'>{`Earned $${(cat.value).toFixed(2)} of $${(cat.target).toFixed(2)} (${pct}%)`}</p>
                                </div>
                            </button>
                            <BudgetModal modalId={`budgetModal${cat.id}`} category={cat} forcePageUpdate={forcePageUpdate}/>
                        </div>
                    })
                : 
                    sortedExpenseData.map((cat) => {
                        let pct = (100 * cat.value / cat.target).toFixed(2)
                        return <div key={cat.id}>
                            <button
                                onClick={() => {document.getElementById(`budgetModal${cat.id}`).showModal()}}
                                className='budgetCard w-full card border-2 m-3 bg-base-200 border-gray-500 hover:border-3 bg-no-repeat transition duration-1000 bg-size-[0%] transition-[background-size] hover:cursor-pointer' 
                                style={{ backgroundImage: `linear-gradient(to right,rgb(187, 187, 187) ${pct}%, transparent ${pct}%)`}}
                            >
                                <div className='card-body p-3'>
                                    <h2 className='card-title text-2xl text-left'>{cat.name}</h2>
                                    <p className='text-lg text-left'>{`Spent $${(cat.value).toFixed(2)} of $${(cat.target).toFixed(2)} (${pct}%)`}</p>
                                </div>
                            </button>
                            <BudgetModal modalId={`budgetModal${cat.id}`} category={cat} forcePageUpdate={forcePageUpdate}/>
                        </div>
                    })
                }

                <button className='btn btn-primary' onClick={() => {document.getElementById(`createNew${isIncomeSelected ? 'Income' : "Expense"}`).showModal()}}>+ Add New Category</button>
                <CategoryForm modalId={`createNew${isIncomeSelected ? "Income" : "Expense"}`} isIncome={isIncomeSelected} forcePageUpdate={forcePageUpdate}/>
            </div>
        </div>
    </div>
    
}