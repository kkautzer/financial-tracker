import { useRef } from "react"
import { API_BASE_URL } from "../../../constants";
export default function TransactionForm({presetId = -1, catData = {}, isIncome = false, modalId = '', forcePageUpdate}) {
    function handleSubmission(e) {
        alert("Adding transaction!!");
        fetch(`${API_BASE_URL}/transactions`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(({
                catId: catRef.current.value,
                name: nameRef.current.value,
                amt: amtRef.current.value,
                date: dateRef.current.value
            }))
        }).then(async (res) => {
            let status = res.status;
            let response = await res.json();
            if (status === 200) {
                nameRef.current.value = '';
                amtRef.current.value = '';
                dateRef.current.value = null;
                alert("Successfully added transaction!")
                forcePageUpdate();
            } else {
                alert("Failed to add transactions - see console for further details.");
                console.log(status);
                console.log(response);
            }
        })

    }




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
                    <label htmlFor='category'>Category Name: </label>
                    <select required defaultValue={presetId} className="mb-2 block w-full rounded-md bg-white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400  hover:cursor-pointer hover:outline-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" id='category' name='category' ref={catRef}>
                        {catData.map((cat) => {
                            return <option key={cat.id} value={cat.id}>{cat.name}</option>
                        })}
                    </select>

                    <label htmlFor='name'>Transaction Name: </label>
                    <input className="mb-2 block w-full rounded-md bg-white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" type='text' placeholder="Name" id='name' name='name' ref={nameRef}/>
                    
                    <label htmlFor='amount'>Amount: </label>
                    <input className="mb-2 block w-full rounded-md bg-white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" type='number' step='0.01' min='0' placeholder="$0.00" id='amount' name='amount' ref={amtRef}/>
                    
                    <label htmlFor='date'>Transaction Date:</label>
                    <input className='block w-full rounded-md bg0white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6' type='date' id='date' name='date' ref={dateRef}/> 
                    <button className="btn btn-primary mt-2 mr-1" onClick={handleSubmission}>Add</button>
                    <button className="btn  bg-[#d1d1d1] hover:bg-[#aaaaaa] mt-2 ml-1">Cancel</button>
                </form>
            </div>
        </dialog>
    </>
}