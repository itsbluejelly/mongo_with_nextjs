// IMPORTING NECESSARY FILES
    // IMPORTING MODULES
import * as bcrypt from "bcryptjs"
import { jwtSign } from "@/libs/jwtVerifier"
import {isEmail} from "validator"
    // IMPORTING SERVER ITEMS
import {NextRequest, NextResponse} from "next/server"
    // IMPORTING MIDDLEWARE
import eventLogger from "@/libs/eventLogger"
import connectDB from "@/libs/connectDB"
    // IMPORTING MODELS
import UserSchema from "@/models/User"

// A FUNCTION TO HANDLE THE SIGNUP ROUTE UNDER AUTH
export async function POST(request: NextRequest){
    try{
        // DESTRUCTURING THE EMAIL AND PASSWORD FROM THE REQUEST
        const {email, password} = await request.json()

        if(!email){
            eventLogger("400: Bad Request", "Missing email property" , "errorLogs.txt")
            return NextResponse.json({ error: "Missing email property" }, { status: 400 })
        }else if(!password){
            eventLogger("400: Bad Request", "Missing password property" , "errorLogs.txt")
            return NextResponse.json({ error: "Missing password property" }, { status: 400 })
        }else if(typeof email !== "string" || !isEmail(email)){
            eventLogger("400: Bad Request", "Email is not a valid email" , "errorLogs.txt")
            return NextResponse.json({ error: "Email is not a valid email" }, { status: 400 })
        }else if(typeof password !== "string"){
            eventLogger("400: Bad Request", "Password is invalid, it should be a string" , "errorLogs.txt")
            return NextResponse.json({ error: "Password is invalid, it should be a string" }, { status: 400 })
        }

        await connectDB()
        
        // FINDING IF THE EMAIL ALREADY EXISTS IN THE DATABASE
        const foundUser = await UserSchema.findOne({email})

        if(foundUser){
            eventLogger("400: Bad Request", `User of email ${email} already exists`, "errorLogs.txt")
            return NextResponse.json({ error: `User of email ${email} already exists` }, { status: 400 })
        }

        // IF USER DOESNT EXIST, THEN CREATE A NEW USER AFTER ENCRYPTING PASSWORD AND ASSIGNING JWT
        const hashSalt = await bcrypt.genSalt(12)
        const hashedPassword: string = await bcrypt.hash(password, hashSalt)
        const {email: newEmail, _id} = await UserSchema.create({email, password: hashedPassword})
        const userID = jwtSign({_id})
        const newUser = {userID, email: newEmail}
        eventLogger("201: Created", `User of id ${newUser.userID} successfully created` , "errorLogs.txt")
        
        // RETURNING USER WITH USERID TOKEN
        return NextResponse.json({
            success: "Signed in successfully",
            data: newUser
        }, { status: 201 })
    }catch(error: unknown){
        eventLogger((error as Error).name, (error as Error).message, "errorLogs.txt")
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}