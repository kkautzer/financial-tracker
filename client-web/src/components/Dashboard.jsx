import Navbar from './Navbar';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Label } from 'recharts';

export default function Dashboard(props) {

    const sampleData = [
        {name:"Food", value: 450},
        { name: "Bills", value: 330 },
        { name: "Transport", value: 150 },
        { name: "Entertainment", value: 100 },
        { name: "Savings", value: 2000 },
        { name: "Loans", value: 800},
        { name: "Rent", value: 2121.18}
    ];
    let sortedSampleData = sampleData;
    sortedSampleData.sort((a,b) => {
        if (a.value > b.value) {
            return -1;
        } else if (a.value < b.value) {
            return 1;
        } else {
            return 0
        }
    });
    
    const total = sampleData.reduce((sum, item) => sum+item.value, 0)
    const income = 6251.18
    const pieColors = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#3b82f6", "#ef4444", "#14b8a6", "#8b5cf6", "#f97316", "#22c55e"];

    return <div className=''>
        <div className='my-4 mx-15'>
            <div className='text-xl flex align-middle'>
                <div className='basis-1/4 text-center'><button className='btn btn-primary'>Previous</button></div>
                <div className='basis-1/2 text-center'>Select Period</div>
                <div className='basis-1/4 text-center'><button className='btn btn-primary'>Next</button></div>
            </div>

            <div className='flex align-middle mx-10'>
                <div className='card basis-1/3 border-2 m-3'> { /* income card */}
                    <div className='card-body'>
                        <h2 className='card-title justify-center text-center text-6xl'>${income}</h2>
                        <h4 className='justify-center text-center text-xl'>Total Income</h4>
                    </div>
                </div>
                <div className='card basis-1/3 border-2 m-3'> { /* expense card */}
                    <div className='card-body'>
                        <h2 className='card-title justify-center text-center text-6xl'>${total.toFixed(2)}</h2>
                        <h4 className='justify-center text-center text-xl'>Total Expenses</h4>
                    </div>
                </div>
                <div className='card basis-1/3 border-2 m-3'> { /* budget card */}
                    <div className='card-body'>
                        <h2 className='card-title justify-center text-center text-6xl'>${(income-total).toFixed(2)}</h2>
                        <h4 className='justify-center text-center text-xl'>Remaining Budget</h4>
                    </div>
                </div>
            </div>

            <div className='xl:flex align-middle mx-7 xl:mx-10'>
                <div className='xl:basis-1/2 m-3'> {/* pie chart container*/} 
                    <ResponsiveContainer width='100%' style={{aspectRatio:'1/1'}}>
                        <PieChart>
                            <Pie dataKey="value" cx='50%' cy='50%' data={sampleData} label={ ({name}) => `${name}`} innerRadius={'45%'} outerRadius={'70%'}>
                                {sampleData.map((entry, index) => {
                                    return <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                })}
                            </Pie>
                            <Tooltip 
                                content={ ({active, payload, label}) => {
                                    if (active && payload && payload.length) {
                                        return <div className='custom-tooltip bg-white p-3 border-1 border-gray rounded-md'>
                                                <p className='text-lg'>{`${payload[0].name}: $${payload[0].value.toFixed(2)}`}</p>
                                                <p className='text-gray-500'>{`${(100*payload[0].value / total).toFixed(2)}% of expenses`}</p>
                                            </div>    
                                        }
                                }}
                            />
                            <text x='50%' y='47.5%' textAnchor='middle' dominantBaseline='central' className='text-5xl text-base-content'>${total.toFixed(2)}</text>
                            <text x='50%' y='56%' textAnchor='middle' dominantBaseline='central' className='text-lg text-base-content'>Total August Expenses</text>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className='xl:basis-1/2 m-4'>
                    <h2 className='text-3xl text-center'>Top Expenses (August)</h2>
                    {sortedSampleData.slice(0,5).map((item, idx) => {
                        return <div className='card border-2 m-2 p-4' key={idx}>
                            <h2 className='card-title text-2xl'>{item.name}</h2>
                            <h4 className='text-lg'>${item.value.toFixed(2)} | {(100 * item.value / total).toFixed(2)}% of Expenses</h4>
                        </div>
                    })}
                </div>
            </div>

        </div>
    </div>





    // // // // // return <div className='text-gray-800 m-6'>
    // // // // //     <div className='flex justify-center mb-4'>
    // // // // //         <h1 className='font-semibold text-2xl md:text-3xl lg:text-3xl xl:text-4xl'>MyFinanceTracker Dashboard</h1>
    // // // // //     </div>
    // // // // //     <div className='flex flex-col md:flex-row'>
    // // // // //         <div className='md:basis-3/4 lg:basis-1/2 mr-3'>
    // // // // //             <DashboardTransactionRecap/>
    // // // // //         </div>
    // // // // //         <div className='md:basis-1/4 lg:basis-1/2 ml-3 mt-4 md:mt-0'>
    // // // // //             <DashboardIncomeExpenseReports/>
    // // // // //         </div>
    // // // // //     </div>
    // // // // // </div>
}