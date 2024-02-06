"use client"

// IMPORTING NECESSARY FILES
    // IMPORTING MODULES
import React from "react"
    // IMPORTING CONTEXTS
import {UserContext} from "@/contexts/UserContext"
    // IMPORTING TYPES
import { UserContextType } from "@/types/Types"

// DEFINING A HOOK THAT REGULATES USAGE OF THE USER CONTEXT
export default function UserContextHook(): UserContextType{
    const context: UserContextType | null = React.useContext(UserContext)

    if(!context){
        throw new Error("The context you are looking for is not provided by usercontext")
    }

    return context
}