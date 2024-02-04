// IMPORTING NECESSARY FILES
    // IMPORTING SERVER ITEMS
import {NextRequest, NextResponse} from "next/server"
    // IMPORTING MIDDLEWARE
import {verifyJWT} from "@/libs/jwtVerifier"
import eventLogger from "./eventLogger"
    // IMPORTING TYPES
import {Types, isValidObjectId} from "mongoose"
import { UserID } from "@/libs/jwtVerifier"

// DEFINING A GENERIC FOR FORMATTING INTERSECTION TYPES
export type Prettier<Type extends object> = {
    [name in keyof Type] : Type[name]
}

// DEFINING THE PROPERREQUEST TYPE
export type ProperRequest = Prettier<NextRequest & { storedUser: { _id: Types.ObjectId }}>

// EXPORTING A MIDDLWARE THAT CHECKS FOR THE JWT THAT HOLDS THE USER ID
export default function userVerifier(request: NextRequest){
    try{
        // GET THE STRING FROM THE AUTH HEADER
        const authorization: string | null = request.headers.get('authorization')

        if(!authorization){
            eventLogger("400: Bad Request", "Missing authorization header in request", "errorLogs.txt")
            return NextResponse.json({ error:  "Missing authorization header in request" }, { status: 400 })
        }

        // OBTAIN THE TOKEN FROM THE HEADER
        const token: string = authorization.split(' ')[1]
        const {_id} = verifyJWT(token) as UserID

        if(!_id){
            eventLogger("401: Unauthorized", "You are not registered in our database, try logging in or signing up", "errorLogs.txt")
            return NextResponse.json({ error:  "You are not registered in our database, try logging in or signing up" }, { status: 401 })
        }else if(!isValidObjectId(_id)){
            eventLogger("403: Forbidden", "Tampered token detected", "errorLogs.txt")
            return NextResponse.json({ error:  "Tampered token detected" }, { status: 403 })
        }

        // APPEND THE USERID TO THE REQUEST
        const newRequest = request as ProperRequest
        newRequest.storedUser = {_id}
        return newRequest
    }catch(error: unknown){
        eventLogger((error as Error).name, (error as Error).message, "errorLogs.txt")
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}