// IMPORTING NECESSARY FILES
    // IMPORTING MODULES
import * as bcrypt from "bcryptjs"
import {jwtSign} from "@/libs/jwtVerifier"
import {isEmail} from "validator"
    // IMPORTING SERVER ITEMS
import {NextRequest, NextResponse} from "next/server"
import {cookies} from  "next/headers"
    // IMPORTING MIDDLEWARE
import eventLogger from "@/libs/eventLogger"
import connectDB from "@/libs/connectDB"
    // IMPORTING MODELS
import UserSchema from "@/models/User"
    // IMPORTING ENUMS
import { STATUS_CODES } from "@/types/Enums"

// A FUNCTION TO HANDLE THE SIGNUP ROUTE UNDER AUTH
export async function POST(request: NextRequest){
    try{
        // DESTRUCTURING THE EMAIL AND PASSWORD FROM THE REQUEST
        const {email, password} = await request.json()

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
        const foundUser = await UserSchema.findOne({email}).select("email password _id")

        if(!foundUser){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad Request`, `User of email ${email} does not exist`, "errorLogs.txt")
            return NextResponse.json({ error: `User of email ${email} does not exist` }, { status: STATUS_CODES.BAD_REQUEST })
        }else if(!(await bcrypt.compare(password, foundUser.password))){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad Request`, "Invalid password, doesn't match with the one in the database", "errorLogs.txt")
            return NextResponse.json({ error: "Invalid password, doesn't match with the one in the database" }, { status: STATUS_CODES.BAD_REQUEST })
        }

        // IF USER EXISTS, THEN CREATE COOKIES CONTAINING THE USERID AND EMAIL
        const userID: string = jwtSign({ _id: foundUser._id })
        
        cookies().set("userID", userID, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        cookies().set("email", foundUser.email, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        eventLogger(`${STATUS_CODES.SUCCESS}: Success`, `User of id ${userID} successfully logged in` , "databaseLogs.txt")
        
        // RETURNING SUCCESS RESPONSE
        return NextResponse.json({ success: "Logged in successfully" }, { status: STATUS_CODES.SUCCESS })
    }catch(error: unknown){
        eventLogger((error as Error).name, (error as Error).message, "errorLogs.txt")
        return NextResponse.json({ error: (error as Error).message }, { status: STATUS_CODES.INTERNAL_SERVER_ERROR })
    }
}