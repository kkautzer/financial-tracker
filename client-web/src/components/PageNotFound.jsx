import { NavLink } from "react-router";

export default function PageNotFound() {
    return <div className="justify-center text-center mt-3">
        <p className="text-2xl">404. That means we couldn't find this page.</p>
        <p>Return to your dashboard or the login screen <NavLink to='/app' className='link link-primary'>here</NavLink>.</p>
    </div>
}