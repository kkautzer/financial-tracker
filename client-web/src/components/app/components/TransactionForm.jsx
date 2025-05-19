export default function TransactionForm({isIncome = false, handleSubmission = () => {}, modalId = '' }) {
    return <>
        <dialog id={modalId} className='modal'>
            <div className='modal-box max-w-5xl'>
                <form method='dialog'><button className="text-xl btn btn-sm btn-circle btn-ghost absolute right-5 top-5">✕</button></form>
                <h3 className='font-bold text-2xl mb-2'>Add {(isIncome ? "Income" : "Expense")}</h3>
                <form method='dialog'>
                    <input className="block w-full rounded-md bg-white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" type='text' placeholder="Category" id='category'/>
                    <input className="block w-full rounded-md bg-white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" type='text' placeholder="Name" id='name'/>
                    <input className="block w-full rounded-md bg-white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" type='text' placeholder="Amount" id='amount'/>
                    <button className="btn btn-primary mt-2 mr-1" onClick={handleSubmission}>Add</button>
                    <button className="btn btn-gray-300 mt-2 ml-1">Cancel</button>
                </form>
            </div>
        </dialog>
    </>
}