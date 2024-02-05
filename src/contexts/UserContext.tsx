"use client"

// IMPORTING NECESSARY FILES
    // IMPORTING MODULES
import React from "react"
import {useCook}
    // IMPORTING TYPES
import { UserContextType, UserContextReducerStateType, UserContextReducerActionType, User} from "@/types/Types"
    // IMPORTING ENUMS
import { USER_CONTEXT_REDUCER_ACTION_TYPE } from "@/types/Enums"

// DECLARING A USERCONTEXT
const UserContext = React.createContext<UserContextType | null>(null)

// DECLARING THE INITIAL VALUES OF THE USER CONTEXT
const initialState: UserContextReducerStateType = {
    user: null,
    error: ''
}

// DECLARING A REDUCER FOR THE USER CONTEXT
function UserContextReducer(state: UserContextReducerStateType, action: UserContextReducerActionType): UserContextReducerStateType{
    switch(action.type){
        case USER_CONTEXT_REDUCER_ACTION_TYPE.DELETE_USER:
            
            return {...state, user: null, error: ""}
        default:
            return state
    }
}

// EXPORTING A USERCONTEXT PROVIDER FUNCTION