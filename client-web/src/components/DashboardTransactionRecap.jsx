import DashboardSingleTransactionRecap from "./DashboardSingleTransactionRecap";

export default function DashboardTransactionRecap(props) {
    return <>
        <p>{"Select Account(s)"}</p>
        {/* filter data from context based on the selected accounts */}
        <h2 className='text-2xl md:text-3xl xl:text-4xl'>Upcoming Transactions</h2>
            {/* add a for-each loop here for all of the transactions within the selected time period */}
            <DashboardSingleTransactionRecap
                name={"Payday"}
                expense={false}
                amount={2027.33}
                pBalance={13662.96}
                date={"April 3, 2025"}
                frequency={"every two weeks"}
                category={"Full-Time Job"}
            />
        <h2 className='text-2xl md:text-3xl xl:text-4xl'>Recent Transactions</h2>
            {/* add a for-each loop here for all of the transactions within the selected time period */}
            <DashboardSingleTransactionRecap
                name={"Grocery Shopping"}
                expense={true} 
                amount={117.04}
                pBalance={13662.96+117.04}
                date={"March 30, 2025"}
                frequency={"one-time"}
                category={"Groceries"} 
            />
            <DashboardSingleTransactionRecap
                name={"Grocery Shopping"}
                expense={true} 
                amount={195.10}
                pBalance={13662.96+117.04+195.10}
                date={"March 24, 2025"}
                frequency={"one-time"}
                category={"Groceries"} 
            />
            <DashboardSingleTransactionRecap
                name={"Payday"}
                expense={false}
                amount={2027.33}
                pBalance={13662.96+117.04+195.10-2027.33}
                date={"March 20, 2025"}
                frequency={"every two weeks"}
                category={"Full-Time Job"}
            />
    </>
}