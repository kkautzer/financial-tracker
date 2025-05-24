import { useRef } from 'react'
export default function BudgetModal({
    modalId='', category={}, initialBudget = 0, isIncome = false, 
    handleSubmission = () => {console.log("No submission action specified. Closing modal by default...")}, 
    handleDeletion = () => {console.log("No deletion action specified. Closing modal by default...")}
}) {

    const budgetRef = useRef(null);
    const bTypeRef = useRef(null);

    return <>
        <dialog id={modalId} className='modal'>
            <div className='modal-box max-w-5xl'>
                <form method='dialog'><button className="text-xl btn btn-sm btn-circle btn-ghost absolute right-5 top-5">✕</button></form>
                <h3 className='font-bold text-2xl mb-2'>Modify {(isIncome) ? "Income" : "Expense"} Category{(category?.name) ? " - " + category.name : ''}</h3>
                <form method='dialog'>
                    {(isIncome) ? '' : <>
                        <label for='budgetType'>Budget Type: </label>
                        <select className="mb-2 block w-full rounded-md bg-white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 hover:cursor-pointer hover:outline-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" id='budgetType' ref={bTypeRef}>
                            <option value='amt'>Amount ($)</option>
                            <option disabled value='pct'>Percentage (%)</option>
                        </select>
                    </>
                    }

                    <label for='budget'>New Budget Value: </label>
                    <input id='budget' className="block w-full rounded-md bg-white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" type='number' placeholder={`$${initialBudget.toFixed(2)}`} ref={budgetRef}/>
                    <button className="btn btn-primary mt-2 mr-1" onClick={handleSubmission}>Save</button>
                    <button className="btn bg-[#d1d1d1] hover:bg-[#aaaaaa] mt-2 ml-1 mr-1">Cancel</button>
                    <button className="btn bg-[#ad1717] hover:bg-[#991717] text-[white] mt-2 ml-1" onClick={handleDeletion}>Delete Category</button>
                </form>
            </div>
        </dialog>
    </>
}