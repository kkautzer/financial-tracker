export default function Profile() {
    return <div className=''>
        <div className='my-4 mx-15'>
            <div>
                <h3 className="text-xl">Profile Picture</h3>
                <form className="px-5">

                    <label htmlFor="pfp" className="mt-2 block text-sm/6 font-medium text-gray-900">Upload Profile Picture</label>
                    <input type='file' id='pfp' className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                    <button className="btn btn-primary mt-2 mr-1" onClick={() => {}}>Save</button>
                    <button className="btn bg-[#d1d1d1] hover:bg-[#aaaaaa] mt-2 ml-1 mr-1">Cancel</button>
                </form>
            </div>
            <div className="mt-4">
                <h3 className="text-xl">Email</h3>
                <form className="px-5">
                    <label htmlFor="email" className="mt-2 block text-sm/6 font-medium text-gray-900">Email</label>
                    <input type='email' id='email' className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                    
                    <label htmlFor="password" className="mt-2 block text-sm/6 font-medium text-gray-900">Password</label>
                    <input type='password' id='password' className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>

                    <button className="btn btn-primary mt-2 mr-1" onClick={() => {}}>Save</button>
                    <button className="btn bg-[#d1d1d1] hover:bg-[#aaaaaa] mt-2 ml-1 mr-1">Cancel</button>
                </form>
            </div>
            <div className="mt-4">
                <h3 className="text-xl">Password</h3>
                <form className="px-5">
                    <label htmlFor="oldPass" className="mt-2 block text-sm/6 font-medium text-gray-900">Current Password</label>
                    <input type='password' id='oldPass' className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                    
                    <label htmlFor="newPass" className="mt-2 block text-sm/6 font-medium text-gray-900">New Password</label>
                    <input type='password' id='newPass' className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                    
                    <label htmlFor="confPass" className="mt-2 block text-sm/6 font-medium text-gray-900">Confirm New Password</label>
                    <input type='password' id='confPass' className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                    <button className="btn btn-primary mt-2 mr-1" onClick={() => {}}>Save</button>
                    <button className="btn bg-[#d1d1d1] hover:bg-[#aaaaaa] mt-2 ml-1 mr-1">Cancel</button>
                </form>
            </div>
        </div>
    </div>
    
}