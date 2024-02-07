"use client"

// IMPORTING NECESSARY FILES
    // IMPORTING HOOKS
import useRootVerifier from "@/hooks/useRootVerifier"

// A PAGE FOR THE /AUTH/LOGIN ROUTE
export default function LoginPage(){
    useRootVerifier()

    return <h1>Login page, unauthenticated</h1>
}