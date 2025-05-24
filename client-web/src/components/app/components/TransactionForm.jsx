import { useRef } from "react"

export default function TransactionForm({presetId = -1, catData = {}, isIncome = false, handleSubmission = () => {}, modalId = '' }) {
    
    // TODO switch to controlled input, disable submit button if empty
    const catRef = useRef(null);
    const nameRef = useRef(null);
    const amtRef = useRef(null);
    const dateRef = useRef(null);

    return <>
        <dialog id={modalId} className='modal'>
            <div className='modal-box max-w-5xl'>
                <form method='dialog'><button className="text-xl btn btn-sm btn-circle btn-ghost absolute right-5 top-5">✕</button></form>
                <h3 className='font-bold text-2xl mb-2'>Add {(isIncome ? "Income" : "Expense")} Transaction</h3>
                <form method='dialog'>
                    <label for='category'>Category Name: </label>
                    <select required defaultValue={presetId} className="mb-2 block w-full rounded-md bg-white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400  hover:cursor-pointer hover:outline-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" id='category' name='category' ref={nameRef}>
                        {catData.map((cat) => {
                            return <option key={cat.id} value={cat.id}>{cat.name}</option>
                        })}
                    </select>

                    <labal for='name'>Transaction Name: </labal>
                    <input className="mb-2 block w-full rounded-md bg-white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" type='text' placeholder="Name" id='name' ref={nameRef}/>
                    
                    <label for='amt'>Amount: </label>
                    <input className="mb-2 block w-full rounded-md bg-white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" type='number' placeholder="$0.00" id='amount' ref={amtRef}/>
                    
                    <label for='date'>Transaction Date:</label>
                    <input className='block w-full rounded-md bg0white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6' type='date' id='date' ref={dateRef}/> 
                    <button className="btn btn-primary mt-2 mr-1" onClick={handleSubmission}>Add</button>
                    <button className="btn btn-gray-300 mt-2 ml-1">Cancel</button>
                </form>
            </div>
        </dialog>
    </>
}