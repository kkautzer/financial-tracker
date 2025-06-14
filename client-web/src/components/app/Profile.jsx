import { useState, useRef, useContext } from 'react'
import { useNavigate } from 'react-router';
import { LoginContext } from '../../contexts/LoginContext';
import { API_BASE_URL } from '../../constants';

export default function Profile() {    
    const navigate = useNavigate();

    const [ editPfp, setEditPfp ] = useState(false);
    const [ editEmail, setEditEmail ] = useState(false);
    const [ editPsw, setEditPsw ] = useState(false);

    const pfpRef = useRef(null);
    const emailRef = useRef(null);
    const pswRef = useRef(null);
    const pswCRef = useRef(null);
    
    function deleteProfile() {
        fetch(`${API_BASE_URL}/profile`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        }).then( async (res) => {
            const status = res.status;
            const data = await res.json();
            if (status === 200) {
                alert("Successfully deleted profile");
                sessionStorage.setItem('login', 'false');
                navigate('/login');
            } else {
                alert("Failed to delete profile - see console for more information.")
                console.log(status);
                console.log(data);
            }
        })
    }

    function updateProfile(event, newPfp, newEmail, newPassword) {
        event.preventDefault();

        fetch(`${API_BASE_URL}/profile`, {
            method: "PUT",
            credentials: 'include',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                pfp: newPfp,
                email: newEmail,
                pass: newPassword
            })
        }).then((res) => {
            if (res.status === 409) {
                alert("This email is already in use!");
            } else if (res.status === 500) {
                console.log("Unknown error occurred - please try again, or try logging out and logging back in.")
            } else if (res.status === 200) {
                pfpRef.current.value = '';
                emailRef.current.value = '';
                pswRef.current.value = '';
                pswCRef.current.value = '';
                setEditPfp(false);
                setEditEmail(false);
                setEditPsw(false);
                alert("Successfully updated profile");
            } else {
                alert("Unknown response status - check console for more information.")
            }
        })
    }

    return <div className=''>
        <div className='my-4 mx-15'>
            <div>
                <div className="flex space-x-1">
                    <h3 className="text-xl">Profile Picture</h3>
                    {/* <button
                        className="border-gray-700 rounded-xl p-1 hover:bg-gray-200 hover:cursor-pointer"
                        onClick={() => {
                            emailRef.current.value = '';
                            pswRef.current.value = '';
                            pswCRef.current.value = '';
                            setEditPfp(true);
                            setEditEmail(false);
                            setEditPsw(false);
                        }}
                    ><img alt="Edit Field Button" src="/src/components/assets/edit-field.png" className='h-4'/></button> */}
                </div>
                <form className="px-5">
                    <label htmlFor="pfp" className="mt-2 block text-sm/6 font-medium text-gray-900">Upload Profile Picture</label>
                    <input ref={pfpRef} disabled={!editPfp} type='file' id='pfp' className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:bg-gray-100 disabled:text-gray-400"/>
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            fetch(`${API_BASE_URL}/profile`, {
                                method: "PUT",
                                credentials: 'include',
                                headers: {
                                    'Content-Type': "application/json"
                                },
                                body: {
                                    pfp: pfpRef.current.value,
                                    email: null,
                                    psw: null
                                }
                            })
                            // fetch to endpoint
                        }}
                        disabled={!editPfp} 
                        className="btn btn-primary mt-2 mr-1"
                    >Save</button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            // clear refs
                            pfpRef.current.value = '';
                            setEditPfp(false);
                        }} 
                        disabled={!editPfp}
                        className="btn bg-[#d1d1d1] hover:bg-[#aaaaaa] mt-2 ml-1 mr-1"
                    >Cancel</button>
                </form>
            </div>

            <div className="mt-4">
                <div className="flex space-x-1">
                    <h3 className="text-xl">Email</h3>
                    <button
                        className="border-gray-700 rounded-xl p-1 hover:bg-gray-200 hover:cursor-pointer"
                        onClick={() => {
                            pfpRef.current.value = '';
                            pswRef.current.value = '';
                            pswCRef.current.value = '';
                            setEditPfp(false);
                            setEditEmail(true);
                            setEditPsw(false);
                        }}
                    ><img alt="Edit Field Button" src="/src/components/assets/edit-field.png" className='h-4'/></button>
                </div>
                <form className="px-5">
                    <label htmlFor="email" className="mt-2 block text-sm/6 font-medium text-gray-900">New Email</label>
                    <input ref={emailRef} disabled={!editEmail} required type='email' id='email' className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:bg-gray-100"/>
                    <button 
                        onClick={(e) => {
                            if (emailRef.current.value === '') {
                                alert("Email cannot be blank");
                                return;
                            }

                            updateProfile(e, null, emailRef.current.value, null)
                        }}
                        disabled={!editEmail} 
                        className="btn btn-primary mt-2 mr-1"
                    >Save</button>

                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            // clear refs
                            emailRef.current.value = '';
                            setEditEmail(false);
                        }} 
                        disabled={!editEmail}
                        className="btn bg-[#d1d1d1] hover:bg-[#aaaaaa] mt-2 ml-1 mr-1"
                    >Cancel</button>
                </form>
            </div>

            <div className="mt-4">
                <div className="flex space-x-1">
                    <h3 className="text-xl">Password</h3>
                    <button
                        className="border-gray-700 rounded-xl p-1 hover:bg-gray-200 hover:cursor-pointer"
                        onClick={() => {
                            pfpRef.current.value = '';
                            emailRef.current.value = '';
                            setEditPfp(false);
                            setEditEmail(false);
                            setEditPsw(true);
                        }}
                    ><img alt="Edit Field Button" src="/src/components/assets/edit-field.png" className='h-4'/></button>
                </div>
                <form className="px-5">                    
                    <label htmlFor="newPass" className="mt-2 block text-sm/6 font-medium text-gray-900">New Password</label>
                    <input ref={pswRef} disabled={!editPsw} required type='password' id='newPass' className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:bg-gray-100"/>
                    
                    <label htmlFor="confPass" className="mt-2 block text-sm/6 font-medium text-gray-900">Confirm New Password</label>
                    <input ref={pswCRef} disabled={!editPsw} required type='password' id='confPass' className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:bg-gray-100"/>

                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            if (pswRef.current.value === '') {
                                alert("Password cannot be blank");
                                return;
                            }
                            if (pswRef.current.value !== pswCRef.current.value) {
                                alert("Passwords do not match.")
                                return;
                            }
                            updateProfile(e, null, null, pswRef.current.value);
                        }}

                        disabled={!editPsw} 
                        className="btn btn-primary mt-2 mr-1"
                    >Save</button>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            pswRef.current.value = '';
                            pswCRef.current.value = '';
                            // clear refs
                            setEditPsw(false);
                        }} 
                        disabled={!editPsw} 
                        className="btn bg-[#d1d1d1] hover:bg-[#aaaaaa] mt-2 ml-1 mr-1"
                    >Cancel</button>
                </form>
            </div>
            <div className='mt-4'>
                <button className='btn bg-[#ad1717] hover:bg-[#991717] text-[white]' onClick={deleteProfile}>Delete Account</button>
            </div>
        </div>
        {/* <PasswordConfirmationModal /> */} 
    </div>
    
}