// IMPORTING NECESSARY FILES
    // IMPORTING SERVER ITEMS
import {NextRequest, NextResponse} from "next/server"
    // IMPORTING MIDDLEWARE
import {verifyJWT} from "@/libs/jwtVerifier"
import eventLogger from "./eventLogger"
    // IMPORTING TYPES
import { UserID } from "@/types/Types"
import {ProperRequest} from "@/types/Types"
    // IMPORTING MODULES
import {isValidObjectId} from "mongoose"
    // IMPORTING ENUMS
import {STATUS_CODES} from "@/types/Enums"

// EXPORTING A MIDDLWARE THAT CHECKS FOR THE JWT THAT HOLDS THE USER ID
export default function userVerifier(request: NextRequest){
    try{
        // GET THE TOKEN FROM THE USERID HEADER
        const token: string | undefined = request.cookies.get("userID")?.value

        if(!token){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad Request`, "Missing userID cookie in request", "errorLogs.txt")
            return NextResponse.json({ error:  "Missing userID cookie in request" }, { status: STATUS_CODES.BAD_REQUEST })
        }

        // OBTAIN THE USERID FROM THE TOKEN
        const {_id} = verifyJWT(token) as UserID

        if(!_id){
            eventLogger(`${STATUS_CODES.UNAUTHORIZED}: Unauthorized`, "You are not registered in our database, try logging in or signing up", "errorLogs.txt")
            return NextResponse.json({ error:  "You are not registered in our database, try logging in or signing up" }, { status: STATUS_CODES.UNAUTHORIZED })
        }else if(!isValidObjectId(_id)){
            eventLogger(`${STATUS_CODES.FORBIDDEN}: Forbidden`, "Tampered token detected", "errorLogs.txt")
            return NextResponse.json({ error:  "Tampered token detected" }, { status: STATUS_CODES.FORBIDDEN })
        }

        // APPEND THE USERID TO THE REQUEST
        const newRequest = request as ProperRequest
        newRequest.storedUser = {_id}
        return newRequest
    }catch(error: unknown){
        eventLogger((error as Error).name, (error as Error).message, "errorLogs.txt")
        return NextResponse.json({ error: (error as Error).message }, { status: STATUS_CODES.INTERNAL_SERVER_ERROR })
    }
}