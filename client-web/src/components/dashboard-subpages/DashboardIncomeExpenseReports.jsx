import { useContext } from "react";
import { PieChart, Pie, Cell, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import FinanceDataContext from "../../contexts/FinanceDataContext";
import PageContext from "../../contexts/PageContext";

import CategorySummary from "./CategorySummary";

export default function DashboardIncomeExpenseReports() {

    const financeDataContext = useContext(FinanceDataContext);
    const setPage = useContext(PageContext);

    let categories = financeDataContext[0].categories;
    let transactions = financeDataContext[0].transactions;
    let categoryIdToAmt = {}; // map category id to total sum of transactions

    transactions.filter((trnsc) => { // filter within 30 days
        return Math.abs(Date.now() - new Date(trnsc['transaction_date']) ) < 30*24*60*60*1000
    }).forEach((trnsc) => { // sum data across transactions for category sums
        if (!categoryIdToAmt[trnsc['category_id']]) { 
            categoryIdToAmt[trnsc['category_id']] = {};
            categoryIdToAmt[trnsc['category_id']]['amt'] = 0.0;
            categoryIdToAmt[trnsc['category_id']]['qty'] = 0;
        }
        categoryIdToAmt[trnsc['category_id']]['amt'] += parseFloat(trnsc['transaction_amt']);
        categoryIdToAmt[trnsc['category_id']]['qty'] += 1;
    });

    const incomeData = [];
    const expenseData = [];
    categories.forEach((cat) => {
        if (cat['category_is_expense'] > 0) {
            expenseData.push({
                id: cat['category_id'],
                category: cat['category_name'],
                amt: categoryIdToAmt[cat['category_id']]['amt'],
                qty: categoryIdToAmt[cat['category_id']]['qty']
            });
        } else {
            incomeData.push({
                id: cat['category_id'],
                category: cat['category_name'],
                amt: categoryIdToAmt[cat['category_id']]['amt'],
                qty: categoryIdToAmt[cat['category_id']]['qty']
            });
        }
    })

    // sort incomeData and expenseData (high to low)


    // for pie graphs
    const COLORS_INCOME = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const COLORS_EXPENSE = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    
    return <div>
        <div className='flex flex-col lg:flex-row mt-4'>
            <div className="lg:basis-1/2">
                <PieChart className='mx-auto' width={225} height={225}>
                    <Pie data={incomeData} dataKey="amt" nameKey="category"  outerRadius={100}>
                            {incomeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS_INCOME[index % COLORS_INCOME.length]} />
                            ))}
                    </Pie>
                    <Tooltip formatter={(val, name, props) => { return "$"+val.toFixed(2)}}/>
                </PieChart>
            </div>
            <div className='lg:basis-1/2'>
                {incomeData.map((data)=> {
                    return <CategorySummary key={data['id']} category={data['category']} amt={data['amt']} qty={data['qty']}/>
                })}
                <button onClick={() => setPage('incomes')} className='w-full text-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover:cursor-pointer mt-3'>View Incomes</button>
            </div>
        </div>

        <div className='flex flex-col lg:flex-row mt-8'>
            <div className="lg:basis-1/2">
                <PieChart className='mx-auto my-auto' width={225} height={225}>
                    <Pie data={expenseData} dataKey="amt" nameKey="category" outerRadius={100}>
                        {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS_EXPENSE[index % COLORS_EXPENSE.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(val, name, props) => { return "$"+val.toFixed(2)}}/>
                </PieChart>
            </div>
            <div className='lg:basis-1/2'>
                {expenseData.map((data) => {
                    return <CategorySummary key={data['id']} category={data['category']} amt={data['amt']} qty={data['qty']} />
                })}
                
                <button onClick={() => setPage('expenses')} className='w-full text-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover:cursor-pointer mt-3'>View Expenses</button>
            </div>
        </div>
    </div>
    
}