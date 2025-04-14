import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        
        // make call to logout endpoint on API
        sessionStorage.setItem('login', 'false');
        navigate('/auth/login')
    }, []);

    return <p>This is the logout page!!</p>
}