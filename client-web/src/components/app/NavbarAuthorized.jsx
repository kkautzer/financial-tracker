import { NavLink } from "react-router";

export default function Navbar() {
    return <div className="sm:navbar bg-primary text-neutral-content">
        <div className="flex-1">
            <NavLink to='/app' className="btn btn-ghost primary-case text-xl">MyFinanceTracker</NavLink>
        </div>
        <div className="flex-none">
            <ul className="menu sm:menu-horizontal px-1 primary-case">
                <li><NavLink to='/app/dashboard'>Dashboard</NavLink></li>
                <li><NavLink to='/app/transactions'>Transactions</NavLink></li>
                <li><NavLink to='/app/budget'>Budget</NavLink></li>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role='button' className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img alt='Profile Picture / User Avatar' src='../assets/temp_pfp.jpg'/>
                            {/* image / PFP goes here!! */}
                        </div>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><NavLink to='/app/profile'>Profile</NavLink></li>
                        <li><NavLink to='/app/settings'>Settings</NavLink></li>
                        <li><NavLink to='/app/logout'>Logout</NavLink></li>
                    </ul>
                </div>
                
            </ul>
        </div>
    </div>
}