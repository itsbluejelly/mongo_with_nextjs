// IMPORTING NECESSARY FILES
    // IMPORTING TYPES
import { Types } from "mongoose"
import { NextRequest } from "next/server"
    // IMPORTING GENERICS
import {
    Prettier, 
    Omitter, 
    OptionalGenerator, 
    ObjectTypeGenerator,
    Commonify
} from "@/types/Generics"
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
export type UserType = Omitter<User, "password">

// A TYPE FOR THE USERCONTEXTREDUCER STATE
export type UserContextReducerStateType = { 
    user: UserType | null,
    error: string,
    loading: boolean,
    success: string 
}

// A TYPE FOR THE USERCONTEXTREDUCER ACTION
export type UserContextReducerActionType = ObjectTypeGenerator<{
    [USER_CONTEXT_REDUCER_ACTION_TYPE.DELETE_USER]: User,

    [USER_CONTEXT_REDUCER_ACTION_TYPE.SET_USER]: {
        user: User, 
        route: "login" | "signup"
    },

    [USER_CONTEXT_REDUCER_ACTION_TYPE.GET_USER]: void,
}>

// A TYPE FOR THE AUTH RESPONSE
export type AuthResponse = Commonify<OptionalGenerator<
    Omitter<UserContextReducerStateType, "loading"> & UserType
>, unknown>

// A TYPE FOR THE AUTH RESPONSE VALUES
export type AuthResponseValues = ObjectTypeGenerator<{
    [USER_CONTEXT_REDUCER_ACTION_TYPE.DELETE_USER]: Omitter<AuthResponse, "user">,
    [USER_CONTEXT_REDUCER_ACTION_TYPE.SET_USER]: Omitter<AuthResponse, "user">,
    [USER_CONTEXT_REDUCER_ACTION_TYPE.GET_USER]: AuthResponse,
}>