import { useRef, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { API_BASE_URL } from '../../constants.js';

export default function Login(props) {
    const navigate = useNavigate();
    const emailRef = useRef('');
    const passRef = useRef('');
    const [ errMsg, setErrMsg ] = useState('');
    const [ isLoading, setIsLoading ] = useState(false);

    const loginStatus = sessionStorage.getItem('login') || 'false';
    if (loginStatus === 'true') {
        useEffect(() => {
            navigate('/app/dashboard');
        }, [loginStatus])
    }

    function attemptLogin(e) {
        e.preventDefault();
        
        setIsLoading(true);

        fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: emailRef.current.value,
                password: passRef.current.value
            })
        }).then(async (res) => {
            let status = res.status;
            let response = await res.json();
            if (status === 200) {
                // set user login data
                emailRef.current.value='';
                passRef.current.value='';
                sessionStorage.setItem("login", true);
                setErrMsg('');
                navigate('/app');
            } else {
                passRef.current.value = '';
                if (status === 401) {
                    setErrMsg("Incorrect Username or Password!");
                } else if (status === 500) {
                    setErrMsg("Internal Error - Please Try Again Later!");
                }
            }
            setIsLoading(false);
        });
    }
    
    return <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="MyFinanceTracker Logo"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                    className="mx-auto h-10 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={attemptLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input ref={emailRef} id="email" name="email" type="email" required autoComplete="email"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                Password
                            </label>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input ref={passRef} id="password" name="password" type="password" required autoComplete="current-password"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                        </div>
                    </div>
                    { (isLoading) 
                        ? <p className='font-medium text-gray-700 text-center semibold'>Loading...</p>
                        : <p className='font-medium text-red-600 text-center semibold'>{errMsg}</p>
                    }
                    <div>
                        <button type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover:cursor-pointer">
                            Sign in
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Don't have an account?{' '}
                    <NavLink to='/auth/register' className="font-semibold text-indigo-600 hover:text-indigo-500 hover:cursor-pointer">
                    Register / Sign Up
                    </NavLink>
                </p>
            </div>
        </div>
    </>
}