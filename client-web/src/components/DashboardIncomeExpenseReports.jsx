export default function DashboardIncomeExpenseReports() {
    return <>
        <p>{"All-Time | Set Time Frame"}</p>
        <div className='flex flex-col lg:flex-row'>
            <p className='lg:basis-1/2'>Pie Graph 1 [Income]</p>
            <p className='lg:basis-1/2'>Income Text Report - Top Categories/Sources, with Percentages & Amounts</p>
        </div>
        <div className='flex flex-col lg:flex-row'>
            <p className='lg:basis-1/2'>Pie Graph 2 [Expenses]</p>
            <p className='lg:basis-1/2'>Expenses Text Report - Top Categories, with Percentages & Amounts</p>

        </div>
    </>
    
}