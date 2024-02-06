// IMPORTING NECESSARY FILES
    // IMPORTING MODULES
import * as bcrypt from "bcryptjs"
import { jwtSign } from "@/libs/jwtVerifier"
import {isEmail} from "validator"
    // IMPORTING SERVER ITEMS
import {NextRequest, NextResponse} from "next/server"
import {cookies} from "next/headers"
    // IMPORTING MIDDLEWARE
import eventLogger from "@/libs/eventLogger"
import connectDB from "@/libs/connectDB"
    // IMPORTING MODELS
import UserSchema from "@/models/User"
    // IMPORTING ENUMS
import {STATUS_CODES} from "@/types/Enums"

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
        const foundUser = await UserSchema.findOne({email})

        if(foundUser){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad Request`, `User of email ${email} already exists`, "errorLogs.txt")
            return NextResponse.json({ error: `User of email ${email} already exists` }, { status: STATUS_CODES.BAD_REQUEST })
        }

        // IF USER DOESNT EXIST, THEN CREATE A NEW USER AFTER ENCRYPTING PASSWORD AND CREATE COOKIES CONTAINING USERID AND EMAIL
        const hashSalt = await bcrypt.genSalt(12)
        const hashedPassword: string = await bcrypt.hash(password, hashSalt)
        const {email: newEmail, _id} = await UserSchema.create({email, password: hashedPassword})
        const userID = jwtSign({_id})
        
        cookies().set("userID", userID, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        cookies().set("email", newEmail, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        })
        
        eventLogger(`${STATUS_CODES.CREATED}: Created`, `User of id ${userID} successfully created` , "databaseLogs.txt")
        
        // RETURNING USER WITH USERID TOKEN
        return NextResponse.json({ success: "Signed in successfully" }, { status: STATUS_CODES.CREATED })
    }catch(error: unknown){
        eventLogger((error as Error).name, (error as Error).message, "errorLogs.txt")
        return NextResponse.json({ error: (error as Error).message }, { status: STATUS_CODES.INTERNAL_SERVER_ERROR })
    }
}