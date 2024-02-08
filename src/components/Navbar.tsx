"use client"

// IMPORTING NECESSARY FILES
    // IMPORTING COMPONENTS
import Link from "next/link"
    // IMPORTING MODULES
import { useSelector } from "react-redux"
    // IMPORTING TYPES
import { RootState } from "@/redux/store"

// A FUNCTION THAT RETURNS A NAVBAR ELEMENT
export default function Navbar(){
    // OBTAINING THE USER VALUE FROM ITS CONTEXT
    const {user} = useSelector((state: RootState) => state.UserContext)
    
    return(
        user && <nav className="flex justify-between items-center bg-slate-800 px-8 py-3">
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