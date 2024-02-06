// IMPORTING NECESSARY FILES
    // IMPORTING SERVER ITEMS
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
    // IMPORTING MIDDLEWARE
import userVerifier from "@/libs/userVerifier";
import eventLogger from "@/libs/eventLogger";
    // IMPORT TYPES
import { ProperRequest } from "@/types/Types";
    // IMPORTING ENUMS
import {STATUS_CODES} from "@/types/Enums"

// A FUNCTION TO HANDLE THE VERIFY ROUTE UNDER AUTH
export function GET(request: NextRequest){
    try{
        // CHECKING IF USER IS AUTHENTICATED
        const properRequest = userVerifier(request) as ProperRequest
        const {_id: userID} = properRequest.storedUser // NO EFFECT, FOR VERIFICATION PURPOSES

        // GETTING THE EMAIL PROPERTY FROM THE COOKIES IN THE REQUEST
        const email = properRequest.cookies.get("email")?.value

        if(!email){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad Request`, "No email cookie detected in the request header", "errorLogs.txt")
            return NextResponse.json({ error:  "No email cookie detected in the request header" }, { status: STATUS_CODES.BAD_REQUEST })
        }

        // IF EMAIL IS FOUND, PASS IT ALONG AS AN OBJECT
        return NextResponse.json({
            success: "Credentials obtained successfully",
            data: {email}
        }, { status: 200 })
    }catch(error: unknown){
        if((error as Error).message === "Cannot destructure property '_id' of 'properRequest.storedUser' as it is undefined."){
            eventLogger(`${STATUS_CODES.UNAUTHORIZED}: Unauthorized`, "You are not registered in our database, try logging in or signing up", "errorLogs.txt")
            return NextResponse.json({ error:  "You are not registered in our database, try logging in or signing up" }, { status: STATUS_CODES.UNAUTHORIZED })
        }

        eventLogger((error as Error).name, (error as Error).message, "errorLogs.txt")
        return NextResponse.json({ error: (error as Error).message }, { status: STATUS_CODES.INTERNAL_SERVER_ERROR })
    }
}