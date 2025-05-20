import { NavLink } from "react-router";

export default function Navbar() {
    return <div className="sm:navbar bg-primary text-neutral-content">
        <div className="flex-1">
            <NavLink to='/' className="btn btn-ghost primary-case text-xl">MyFinanceTracker</NavLink>
        </div>
        <div className="flex-none">
            <ul className="menu sm:menu-horizontal px-1 primary-case">
                <li><NavLink to='/home'>Home</NavLink></li>
                <li><NavLink to='/about'>About</NavLink></li>
                <li><NavLink to='/login'>Login / Register</NavLink></li>
            </ul>
        </div>
    </div>
}