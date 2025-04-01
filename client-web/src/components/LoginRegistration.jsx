import { useState } from 'react';
import Login from './Login';
import Register from './Register';

export default function LoginRegistration(props) {
    const [ showRegistration, setShowRegistration ] = useState(false);

    return <>
        {(showRegistration) 
            ? <Register showLoginForm={() => setShowRegistration(false)} setLogin={props.setLogin}/>
            : <Login showRegistrationForm={() => setShowRegistration(true)} setLogin={props.setLogin}/>
        }
    </>
}