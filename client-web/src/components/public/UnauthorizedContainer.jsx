import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router"
import Navbar from "../nav/NavbarUnauthorized";

export default function LoginContainer(props) {
    return <>
        <Navbar/>
        <Outlet />
    </>
}