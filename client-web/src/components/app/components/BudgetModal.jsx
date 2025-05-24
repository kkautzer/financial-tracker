import { useRef } from 'react'
import { API_BASE_URL } from '../../../constants';
export default function BudgetModal({ modalId, category, forcePageUpdate }) {

    function handleSubmission(e) {
        fetch(`${API_BASE_URL}/categories`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: category.id,
                name: nameRef.current.value || category.name,
                isExpense: category.type === 'expense',
                budget: budgetRef.current.value || category.target
            })
        }).then( async (res) => {
            const status = res.status;
            const data = await res.json();
            if (status === 200) {
                alert("Successfully updated category");
                forcePageUpdate();
            } else {
                alert("Failed to update category - see console for more information.")
                console.log(status);
                console.log(data);
            }
        })
    }

    function handleDeletion(e) {
        fetch(`${API_BASE_URL}/categories`, {
            method: "DELETE",
            credentials: 'include',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                id: category.id
            })
        }).then( async (res) => {
            const status = res.status;
            const data = await res.json();
            if (status === 200) {
                alert("Successfully deleted category");
            } else {
                alert("Failed to delete category - see console for more information.")
                console.log(status);
                console.log(data);
            }
        })
    }
    
    const nameRef = useRef(null);
    const budgetRef = useRef(null);
    const bTypeRef = useRef(null);

    return <>
        <dialog id={modalId} className='modal'>
            <div className='modal-box max-w-5xl'>
                <form method='dialog'><button className="text-xl btn btn-sm btn-circle btn-ghost absolute right-5 top-5">✕</button></form>
                <h3 className='font-bold text-2xl mb-2'>Modify {category.type.charAt(0).toUpperCase() + category.type.slice(1) } Category{(category?.name) ? " - " + category.name : ''}</h3>
                <form method='dialog'>
                    <label htmlFor='name'>Category Name: </label>
                    <input id='name' name='name' className="mb-2 block w-full rounded-md bg-white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" type='text' placeholder={`${category.name}`} ref={nameRef}/>

                    {(category.type === 'income') ? '' : <>
                        <label htmlFor='budgetType'>Budget Type: </label>
                        <select className="mb-2 block w-full rounded-md bg-white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 hover:cursor-pointer hover:outline-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" id='budgetType' name='budgetType' ref={bTypeRef}>
                            <option value='amt'>Amount ($)</option>
                            <option disabled value='pct'>Percentage (%)</option>
                        </select>
                    </>
                    }

                    <label htmlFor='budget'>New Budget Value: </label>
                    <input id='budget' name='budget' className="block w-full rounded-md bg-white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" type='number' step='0.01' min='0' placeholder={`$${category.target.toFixed(2)}`} ref={budgetRef}/>
                    <button className="btn btn-primary mt-2 mr-1" onClick={handleSubmission}>Save</button>
                    <button className="btn bg-[#d1d1d1] hover:bg-[#aaaaaa] mt-2 ml-1 mr-1">Cancel</button>
                    <button className="btn bg-[#ad1717] hover:bg-[#991717] text-[white] mt-2 ml-1" onClick={handleDeletion}>Delete Category</button>
                </form>
            </div>
        </dialog>
    </>
}