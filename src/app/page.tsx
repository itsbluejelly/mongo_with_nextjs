"use client"

// IMPORTING NECESSARY FILES
    // IMPORTING MODULES
import {useRouter} from "next/navigation"
import React from "react"

// A PAGE FOR THE / ROUTE
export default function Page(){
    const router = useRouter()
    React.useEffect(() => {router.push('/home')})
}