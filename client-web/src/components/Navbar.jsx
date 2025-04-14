import { NavLink } from "react-router";

export default function Navbar() {
    return <div className="navbar bg-primary text-neutral-content">
        <div className="flex-1">
            <NavLink to='/app' className="btn btn-ghost primary-case text-xl">MyFinanceTracker</NavLink>
        </div>
        <div className="flex-none">
            <ul className="menu menu-horizontal px-1 primary-case">
                <li><NavLink to='/app/dashboard'>Dashboard</NavLink></li>
                <li><NavLink to='/app/transactions'>Transactions</NavLink></li>
                <li><NavLink to='/app/budget'>Budget</NavLink></li>
                <li><NavLink to='/app/profile'>Profile</NavLink></li>
            </ul>
        </div>
    </div>
}