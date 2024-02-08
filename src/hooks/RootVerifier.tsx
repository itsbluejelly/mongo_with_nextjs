"use client"

// IMPORTING NECESSARY FILES
    // IMPORTING MODULES
import { useRouter } from "next/navigation";
    // IMPORTING TYPES
import {UserType} from "@/types/Types"

// A HOOK THAT VALIDATES THE ACCESSED ROUTE IN TERMS OF AUTHENTICATION
export default function RootVerifier(user: UserType | null, path: "/home" | "/auth"): void{
    // CHECKING IF THIS CODE IS RUNNING ON THE CLIENT SIDE
    if (typeof window === 'undefined') {
        // Don't execute on the server side
        return;
    }
    // INSTANTIATING THE ROUTER
    const router = useRouter()

    // PERFORMING NECESSARY REROUTING ON CLIENT SIDE
    if(!user && path === "/home"){
        router.push('/auth/login')
    }else if (user && path === "/auth") {
      router.push("/home");
    }
}