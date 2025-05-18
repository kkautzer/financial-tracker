export default function TransactionForm({isIncome = false, handleSubmission = () => {}, modalId = '' }) {
    return <>
        <dialog id={modalId} className='modal'>
            <div className='modal-box max-w-5xl'>
                <form method='dialog'><button className="text-xl btn btn-sm btn-circle btn-ghost absolute right-5 top-5">✕</button></form>
                <h3 className='font-bold text-2xl mb-2'>Add {(isIncome ? "Income" : "Expense")}</h3>
                <form method='dialog'>
                    <input className='text-xl my-1' type='text' placeholder="Category"/>
                    <br/>
                    <input className='text-xl my-1' type='text' placeholder="Name"/>
                    <br/>
                    <input className='text-xl my-1' type='text' placeholder="Amount"/>
                    <br/>
                    <button className="btn btn-primary mt-2 mr-1" onClick={handleSubmission}>Add</button>
                    <button className="btn btn-gray-300 mt-2 ml-1">Cancel</button>
                </form>
            </div>
        </dialog>
    </>
}