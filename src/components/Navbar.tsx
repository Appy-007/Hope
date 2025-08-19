export default function Navbar(){
    return (
        <>
        <nav className=" flex  justify-between px-6 py-4 items-center ">
            <div>
                <h1>Hope</h1>
            </div>
            <div>
                <ul className="hidden md:flex items-center gap-8 p-4 px-8 rounded-full bg-white  shadow-sm bg-opacity-50">
                    <li>Home</li>
                    <li>Ask</li>
                    <li>Contacts</li>
                </ul>
            </div>
            <div>
                Contacts
            </div>
        </nav>
        </>
    )
}