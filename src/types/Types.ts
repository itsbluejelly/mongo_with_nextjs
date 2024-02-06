// IMPORTING NECESSARY FILES
    // IMPORTING TYPES
import { Types } from "mongoose"
import { NextRequest } from "next/server"
    // IMPORTING GENERICS
import {Prettier, Omitter, OptionalGenerator, ActionTypeGenerator} from "@/types/Generics"
    // IMPORTING ENUMS
import { USER_CONTEXT_REDUCER_ACTION_TYPE } from "./Enums"

// DEFINING A TYPE FOR THE USERID
export type UserID = { _id: Types.ObjectId }
// DEFINING A TYPE FOR A PROPER REQUEST
export type ProperRequest = Prettier<NextRequest & { storedUser: UserID }>

// A TYPE FOR THE NOTE MODEL
export type Note = {
    userID: Types.ObjectId,
    title: string
    description?: string
}

// A TYPE FOR THE UPDATE OBJECT
export type UpdateObject = Omitter<OptionalGenerator<Note>, "userID">

// A TYPE FOR THE USER MODEL
export type User = {
    email: string,
    password: string
}

// A TYPE FOR THE USER IN THE CONTEXT
export type UserType = Prettier<Omitter<User, "password"> & { userID: string }>

// A TYPE FOR THE USERCONTEXTREDUCER STATE
export type UserContextReducerStateType = { 
    user: UserType | null,
    error: string 
}

// A TYPE FOR THE USERCONTEXTREDUCER ACTION
export type UserContextReducerActionType = ActionTypeGenerator<{
    [USER_CONTEXT_REDUCER_ACTION_TYPE.DELETE_USER]: never,
    [USER_CONTEXT_REDUCER_ACTION_TYPE.SET_USER]: Omitter<User, "password">
}>

// A TYPE FOR THE USERCONTEXT
export type UserContextType = Prettier<UserContextReducerStateType & { dispatch: React.Dispatch<UserContextReducerActionType> }>