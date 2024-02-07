"use client"

// IMPORTING NECESSARY FILES
    // IMPORTING MODULES
import {useRouter} from "next/navigation"

// A PAGE FOR THE / ROUTE
export default function Page(){
    const router = useRouter()
    router.push('/')
}