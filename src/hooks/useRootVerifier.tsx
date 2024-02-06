"use client"

// IMPORTING NECESSARY FILES
    // IMPORTING MODULES
import { UseSelector, UseDispatch, useSelector, useDispatch} from "react-redux";
import React from "react"
import { useRouter } from "next/router";
    // IMPORTING TYPES
import { RootState, RootDispatch} from "@/redux/store";
    // IMPORTING ACTIONS
import { getUser } from "@/redux/slices/UserContext";

// A HOOK THAT VALIDATES THE ACCESSED ROUTE IN TERMS OF AUTHENTICATION
export default function useRootVerifier(): void{
    // GETTING THE CONTEXT VALUES OF USER FROM THE STORE AND ITS DISPATCH FUNCTION
    const {user, error} = useSelector((state: RootState) => state.UserContext)
    const userDispatch = useDispatch<RootDispatch>()
    // INSTANTIATING THE ROUTER
    const router = useRouter()

    // CHECKING FOR ERRORS
    if(error){
        throw new Error(error)
    }

    // CALLING THE GETUSER FUNCTION
    React.useEffect(() => {userDispatch(getUser())}, [userDispatch])

    // PERFORMING NECESSARY REROUTING ON CLIENT SIDE
    if(!user && router.pathname.startsWith('/home')){
        router.push('/auth/login')
    }else if (user && router.pathname.startsWith("/auth")) {
      router.push("/home");
    }
}