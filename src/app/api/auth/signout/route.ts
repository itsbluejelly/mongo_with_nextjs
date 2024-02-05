// IMPORTING NECESSARY FILES
    // IMPORTING MODULES
import * as bcrypt from "bcryptjs"
import {isEmail} from "validator"
    // IMPORTING SERVER ITEMS
import {NextRequest, NextResponse} from "next/server"
    // IMPORTING MIDDLEWARE
import eventLogger from "@/libs/eventLogger"
import connectDB from "@/libs/connectDB"
import userVerifier from "@/libs/userVerifier"
    // IMPORTING MODELS
import UserSchema from "@/models/User"
import NoteSchema from "@/models/Note"
    // IMPORTING TYPES
import { ProperRequest } from "@/types/Types"
    // IMPORTING ENUMS
import {STATUS_CODES} from "@/types/Enums"

// A FUNCTION TO HANDLE THE SIGNUP ROUTE UNDER AUTH
export async function DELETE(request: NextRequest){
    try{
        // ENSURING THE USER IS AUTHENTICATED
        const properRequest = userVerifier(request) as ProperRequest

        // DESTRUCTURING THE EMAIL, PASSWORD AND USERID FROM THE REQUEST
        const {email, password} = await request.json()
        const {_id:userID} = properRequest.storedUser

        if(!email){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad Request`, "Missing email property" , "errorLogs.txt")
            return NextResponse.json({ error: "Missing email property" }, { status: STATUS_CODES.BAD_REQUEST })
        }else if(!password){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad Request`, "Missing password property" , "errorLogs.txt")
            return NextResponse.json({ error: "Missing password property" }, { status: STATUS_CODES.BAD_REQUEST })
        }else if(typeof email !== "string" || !isEmail(email)){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad Request`, "Email is not a valid email" , "errorLogs.txt")
            return NextResponse.json({ error: "Email is not a valid email" }, { status: STATUS_CODES.BAD_REQUEST })
        }else if(typeof password !== "string"){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad Request`, "Password is invalid, it should be a string" , "errorLogs.txt")
            return NextResponse.json({ error: "Password is invalid, it should be a string" }, { status: STATUS_CODES.BAD_REQUEST })
        }

        await connectDB()
        
        // FINDING IF THE EMAIL ALREADY EXISTS IN THE DATABASE
        const foundUser = await UserSchema.findById(userID)

        if(!foundUser){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad Request`, `User of email ${email} does not exist`, "errorLogs.txt")
            return NextResponse.json({ error: `User of email ${email} does not exist` }, { status: STATUS_CODES.BAD_REQUEST })
        }else if(!(await bcrypt.compare(password, foundUser.password))){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad Request`, "Invalid password, doesn't match with the one in the database", "errorLogs.txt")
            return NextResponse.json({ error: "Invalid password, doesn't match with the one in the database" }, { status: STATUS_CODES.BAD_REQUEST })
        }else if(foundUser.email !== email){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad Request`, "Invalid email, doesn't match with the one in the database", "errorLogs.txt")
            return NextResponse.json({ error: "Invalid email, doesn't match with the one in the database" }, { status: STATUS_CODES.BAD_REQUEST })
        }

        // IF USER EXISTS, THEN DELETE THE USER FROM THE DATABASE
        await NoteSchema.deleteMany({ userID })
        await UserSchema.findByIdAndDelete(userID)
        eventLogger(`${STATUS_CODES.SUCCESS}: Success`, `User of id ${foundUser._id} successfully deleted` , "databaseLogs.txt")
        
        // RETURNING SUCCESS RESPONSE
        return NextResponse.json({ success: "Signed out successfully"}, { status: STATUS_CODES.SUCCESS })
    }catch(error: unknown){
        if((error as Error).message === "Cannot destructure property '_id' of 'properRequest.storedUser' as it is undefined."){
            eventLogger(`${STATUS_CODES.UNAUTHORIZED}: Unauthorized`, "You are not registered in our database, try logging in or signing up", "errorLogs.txt")
            return NextResponse.json({ error:  "You are not registered in our database, try logging in or signing up" }, { status: STATUS_CODES.UNAUTHORIZED })
        }

        eventLogger((error as Error).name, (error as Error).message, "errorLogs.txt")
        return NextResponse.json({ error: (error as Error).message }, { status: STATUS_CODES.INTERNAL_SERVER_ERROR })
    }
}