"use client"

// IMPORTING NECESSARY FILES
    // IMPORTING MODULES
import React from "react"
import {cookies} from "next/headers"
    // IMPORTING TYPES
import { UserContextType, UserContextReducerStateType, UserContextReducerActionType} from "@/types/Types"
import {UserContextProviderProps} from "@/types/Props"
    // IMPORTING ENUMS
import { USER_CONTEXT_REDUCER_ACTION_TYPE } from "@/types/Enums"

// DECLARING A USERCONTEXT
export const UserContext = React.createContext<UserContextType | null>(null)

// DECLARING THE INITIAL VALUES OF THE USER CONTEXT
const initialState: UserContextReducerStateType = { 
    user: null,
    error: '' 
}

// DECLARING A REDUCER FOR THE USER CONTEXT
function UserContextReducer(state: UserContextReducerStateType, action: UserContextReducerActionType): UserContextReducerStateType{
    switch(action.type){
        case USER_CONTEXT_REDUCER_ACTION_TYPE.DELETE_USER:
            cookies().delete("userID")
            localStorage.removeItem("email")

            return {...state, user: null, error: ''}
        case USER_CONTEXT_REDUCER_ACTION_TYPE.SET_USER:{
            const {email} = action.payload
            const userID = cookies().get("userID")?.value

            if(!userID){
                return {...state, user: null, error: "userID not found"}
            }

            localStorage.removeItem("email")

            return {...state, user: {email, userID}}
        }default:
            return state
    }
}

// EXPORTING A USERCONTEXT PROVIDER FUNCTION
export default function UserContextProvider(props: UserContextProviderProps){
    // OBTAIN THE CURRENT STATE AND REDUCER FUNCTION
    const [state, dispatch] = React.useReducer(UserContextReducer, initialState)

    return <UserContext.Provider value={{...state, dispatch}}>{props.children}</UserContext.Provider>
}