// IMPORTING NECESSARY FILES
    // IMPORTING COMPONENTS
import Link from "next/link"

// A FUNCTION THAT RETURNS A NAVBAR ELEMENT
export default function Navbar(){
    return(
        <nav className="flex justify-between items-center bg-slate-800 px-8 py-3">
            <Link 
                href={"/home"} 
                className="text-white font-bold"
            >HomePage</Link>

            <Link 
                href={"/home/addTopic"}
                className="bg-white p-2"
            >Add Topic</Link>
        </nav>
    )
}