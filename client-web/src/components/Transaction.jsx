export default function Transaction(props) {
    /**
     * Contains the following props attributes:
     * name - the name assigned to the transaction (i.e. Groceries, Tuition Payment, etc.)
     * expense - true if income is an expense, false if it is an income
     * amount - amount that this transaction is worth
     * frequency - either "one-time", or how often this transaction occurs (i.e. every two weeks, monthly, etc.)
     * category - category that this transaction belongs to
     * pBalance - balance of the account prior to this transaction
     */
    if (props.expense) {
        return <>
        <p className='text-lg ml-4'>
            {props.name + ": "}
            <span style={{color:"red"}}>{"$"+props.amount.toFixed(2)}</span>
            {", $"+props.pBalance.toFixed(2)}&nbsp;&rarr;&nbsp;
            {<span style={{color:"red"}}>{"$"+((props.pBalance-props.amount).toFixed(2))}</span>}
        </p>
        <p className='ml-8 text-gray-500'>
            {props.date + " | " + props.category + " | " + props.frequency}
        </p>
    </>
    } else {
        return <>
        <p className='text-lg ml-4'>
            {props.name + ": "}
            <span style={{color: "green"}}>{"$"+props.amount.toFixed(2)}</span>
            {", $"+props.pBalance.toFixed(2)}&nbsp;&rarr;&nbsp;
            {<span style={{color:'green'}}>{"$"+(props.pBalance+props.amount).toFixed(2)}</span>}
        </p>
        <p className='ml-8 text-gray-500'>
            {props.date + " | " + props.category + " | " + props.frequency}
        </p>

    </>
    }
    
}