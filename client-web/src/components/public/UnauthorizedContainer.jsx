import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router"
import Navbar from "../nav/NavbarUnauthorized";

export default function LoginContainer(props) {
    const navigate = useNavigate();

    const loginStatus = sessionStorage.getItem('login') || 'false';

    if (loginStatus === 'true') {
        useEffect(() => {
            navigate('/app/dashboard');
        }, [loginStatus])
    } else {
        return <>
            <Navbar/>
            <Outlet />
        </>
    }

}