import { useEffect } from "react";
import { useNavigate } from "react-router";
import { API_BASE_URL } from "../../constants";

export default function Logout() {
    const navigate = useNavigate();
    const loginStatus = sessionStorage.getItem('login') || 'false';

    if (loginStatus !== 'true') {
        navigate('/auth/login');
    } else {
        fetch(`${API_BASE_URL}/logout`, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            sessionStorage.setItem('login', 'false');
            navigate('/auth/login');
        })
    }


    return <p>This is the logout page!!</p>
}