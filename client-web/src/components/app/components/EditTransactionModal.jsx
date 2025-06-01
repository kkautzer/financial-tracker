import { useRef } from 'react'
import { API_BASE_URL } from '../../../constants';
export default function BudgetModal({ modalId, transaction = {}, catData = {}, forcePageUpdate }) {

    function tStringToDate(str) {
        const months = {'Jnauary': "01", "February": '02', "March": '03', "April": "04", "May": "05", "June": "06", "July": "07", "August": "08", "September":'09', "October": '10', "November":'11', "December": '12'}
        const split = str.split(' ');

        return split[2]+'-'+months[split[0]]+'-'+String(parseInt(split[1])).padStart(2, '0');
    }

    function handleSubmission(e) {
        fetch(`${API_BASE_URL}/transactions`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: transaction.id,
                catId: catRef.current.value,
                name: nameRef.current.value,
                amt: amtRef.current.value,
                date: dateRef.current.value
            })
        }).then( async (res) => {
            const status = res.status;
            const data = await res.json();
            if (status === 200) {
                alert("Successfully updated transaction");
                forcePageUpdate();
            } else {
                alert("Failed to update transaction - see console for more information.")
                console.log(status);
                console.log(data);
            }
        })
    }

    function handleDeletion(e) {
        fetch(`${API_BASE_URL}/transactions`, {
            method: "DELETE",
            credentials: 'include',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                id: transaction.id
            })
        }).then( async (res) => {
            const status = res.status;
            const data = await res.json();
            if (status === 200) {
                alert("Successfully deleted transaction");
                forcePageUpdate();
            } else {
                alert("Failed to delete transaction - see console for more information.")
                console.log(status);
                console.log(data);
            }
        })
    }

    const catRef = useRef(null);
    const nameRef = useRef(null);
    const amtRef = useRef(null);
    const dateRef = useRef(null);

    return <>
        <dialog id={modalId} className='modal'>
            <div className='modal-box max-w-5xl'>
                <form method='dialog'><button className="text-xl btn btn-sm btn-circle btn-ghost absolute right-5 top-5">✕</button></form>
                <h3 className='font-bold text-2xl mb-2'>Edit Transaction - {transaction.name}</h3>
                <form method='dialog'>
                    <label htmlFor='category'>Category Name: </label>
                    <select required defaultValue={transaction.categoryId} className="mb-2 block w-full rounded-md bg-white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400  hover:cursor-pointer hover:outline-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" id='category' name='category' ref={catRef}>
                        <optgroup label='Incomes'>
                            {catData.filter((c) => c.type==='income').map((cat) => {
                                return <option key={cat.id} value={cat.id}>{cat.name}</option>
                            })}
                        </optgroup>
                        <optgroup label='Expenses'>
                            {catData.filter((c) => c.type==='expense').map((cat) => {
                                return <option key={cat.id} value={cat.id}>{cat.name}</option>
                            })}
                        </optgroup>
                    </select>

                    <label htmlFor='name'>Transaction Name: </label>
                    <input className="mb-2 block w-full rounded-md bg-white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" type='text' placeholder="Name" id='name' name='name' ref={nameRef} defaultValue={transaction.name}/>
                    
                    <label htmlFor='amount'>Amount: </label>
                    <input className="mb-2 block w-full rounded-md bg-white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" type='number' step='0.01' min='0' id='amount' name='amount' ref={amtRef} defaultValue={transaction.value.toFixed(2)}/>
                    
                    <label htmlFor='date'>Transaction Date:</label>
                    <input className='block w-full rounded-md bg0white px-3 py-1.5 mt-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6' type='date' id='date' name='date' ref={dateRef} defaultValue={tStringToDate(transaction.date)} min='2020-01-01' max={new Date().toISOString().split('T')[0]}/> 
                    <button className="btn btn-primary mt-2 mr-1" onClick={handleSubmission}>Update</button>
                    <button className="btn bg-[#d1d1d1] hover:bg-[#aaaaaa] mt-2 ml-1 mr-1">Cancel</button>
                    <button className='btn bg-[#ad1717] hover:bg-[#991717] text-[white] mt-2 ml-1' onClick={handleDeletion}>Delete</button>
                </form>
            </div>
        </dialog>
    </>

}