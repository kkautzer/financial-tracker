import { useContext } from 'react';
import DashboardTransactionRecap from './DashboardTransactionRecap';
import DashboardIncomeExpenseReports from './DashboardIncomeExpenseReports';

export default function Dashboard(props) {
    return <>
        <h1 className='text-3xl md:text-5xl lg:text-5xl xl:text-6xl text-center'>My Dashboard</h1>
        <div className='flex flex-col md:flex-row'>
            <div className='md:basis-3/4 lg:basis-1/2'>
                <DashboardTransactionRecap/>
            </div>
            <div className='md:basis-1/4 lg:basis-1/2'>
                <DashboardIncomeExpenseReports/>
            </div>
        </div>

    </>
}