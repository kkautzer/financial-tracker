export default function AllTransactions() {
    return <div>
        <p>This is a line graph with the history of account balance based on the parameters</p>
        
        <div>
            <p>This is a dropdown with selection for accounts</p>
        </div>
        <div>
            <p>this section will contain {"<Transaction/>"} components in a block-list-like format, subject to the above selection parameters</p>
            <div>
                <p>Upcoming Transactions</p><p>range selection</p>
            </div>
            <div>
                <p>Upcoming Transactions</p><p>range selection (max. 1yr.)</p>
            </div>
        </div>
    </div>
}