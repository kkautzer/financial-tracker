export default function Navbar() {
    return <div className="navbar bg-primary text-neutral-content">
        <div className="flex-1">
            <a className="btn btn-ghost primary-case text-xl">MyFinanceTracker</a>
        </div>
        <div className="flex-none">
            <ul className="menu menu-horizontal px-1 primary-case">
                <li><a href='/'>Dashboard</a></li>
                <li><a href='/transactions'>Transactions</a></li>
                <li><a href='/budget'>Budget</a></li>
                <li><a href='/profile'>Profile</a></li>
            </ul>
        </div>
    </div>
}