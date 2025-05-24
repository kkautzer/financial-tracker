import { useRef } from "react";
import { API_BASE_URL } from "../../../constants";

export default function BudgetModal({ modalId, isIncome = false, forcePageUpdate}) {

    function handleSubmission(e) {
        fetch(`${API_BASE_URL}/categories`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: categoryRef.current.value,
                isExpense: !isIncome,
                budget: budgetRef.current.value
            })
        }).then(async (res) => {
            const status = res.status;
            const data = await res.json();
            if (status === 200) {
                alert("Successfully created category");
                forcePageUpdate();
            } else {
                alert("Failed to create category - see consoles for more information")
                console.log(status);
                console.log(data);
            }
        })
    }


    const categoryRef = useRef(null);
    const bTypeRef = useRef(null);
    const budgetRef = useRef(null);

    return <>
        <dialog id={modalId} className='modal'>
            <div className='modal-box max-w-5xl'>
                <form method='dialog'><button className="text-xl btn btn-sm btn-circle btn-ghost absolute right-5 top-5">✕</button></form>
                <h3 className='font-bold text-2xl mb-2'>Add {(isIncome) ? "Income" : "Expense"} Category</h3>
                <form method='dialog'>
                    <label htmlFor='category'>Category Name: </label>
                    <input className="mb-2 block w-full rounded-md bg-white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" type='text' placeholder="Category Name" ref={categoryRef} id='category' name='category'/>

                    <label htmlFor='budgetType'>Budget Type: </label>
                    <select className="mb-2 block w-full rounded-md bg-white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 hover:cursor-pointer hover:outline-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" id='budgetType' name='budgetType' ref={bTypeRef}>
                        <option value='amt'>Amount ($)</option>
                        <option disabled value='pct'>Percentage (%)</option>
                    </select>

                    <label htmlFor='budget'>Amount:</label>
                    <input className="block w-full rounded-md bg-white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" type='number' step='0.01' min='0' placeholder="Budget Amount" ref={budgetRef} id='budget' name='budget'/>
                    <button className="btn btn-primary mt-2 mr-1" onClick={handleSubmission}>Create</button>
                    <button className="btn bg-[#d1d1d1] hover:bg-[#aaaaaa] mt-2 ml-1 mr-1">Cancel</button>
                </form>
            </div>
        </dialog>
    </>
}