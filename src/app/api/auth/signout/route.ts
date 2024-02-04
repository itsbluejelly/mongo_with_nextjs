// IMPORTING NECESSARY FILES
    // IMPORTING MODULES
import * as bcrypt from "bcryptjs"
import {jwtSign} from "@/libs/jwtVerifier"
import {isEmail} from "validator"
    // IMPORTING SERVER ITEMS
import {NextRequest, NextResponse} from "next/server"
    // IMPORTING MIDDLEWARE
import eventLogger from "@/libs/eventLogger"
import connectDB from "@/libs/connectDB"
import userVerifier from "@/libs/userVerifier"
    // IMPORTING MODELS
import UserSchema from "@/models/User"
    // IMPORTING TYPES
import { ProperRequest } from "@/libs/userVerifier"

// A FUNCTION TO HANDLE THE SIGNUP ROUTE UNDER AUTH
export async function DELETE(request: NextRequest){
    try{
        // ENSURING THE USER IS AUTHENTICATED
        const properRequest = userVerifier(request) as ProperRequest

        // DESTRUCTURING THE EMAIL, PASSWORD AND USERID FROM THE REQUEST
        const {email, password} = await request.json()
        const {_id:userID} = properRequest.storedUser

        if(!userID){
            eventLogger("401: Unauthorized", "You are not registered in our database, try logging in or signing up", "errorLogs.txt")
            return NextResponse.json({ error:  "You are not registered in our database, try logging in or signing up" }, { status: 401 })
        }

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
        const foundUser = await UserSchema.findById(userID)

        if(!foundUser){
            eventLogger("400: Bad Request", `User of email ${email} does not exist`, "errorLogs.txt")
            return NextResponse.json({ error: `User of email ${email} does not exist` }, { status: 400 })
        }else if(!(await bcrypt.compare(password, foundUser.password))){
            eventLogger("400: Bad Request", "Invalid password, doesn't match with the one in the database", "errorLogs.txt")
            return NextResponse.json({ error: "Invalid password, doesn't match with the one in the database" }, { status: 400 })
        }else if(foundUser.email !== email){
            eventLogger("400: Bad Request", "Invalid email, doesn't match with the one in the database", "errorLogs.txt")
            return NextResponse.json({ error: "Invalid email, doesn't match with the one in the database" }, { status: 400 })
        }

        // IF USER EXISTS, THEN DELETE THE USER FROM THE DATABASE
        await UserSchema.findByIdAndDelete(userID)
        eventLogger("200: Success", `User of id ${foundUser._id} successfully deleted` , "databaseLogs.txt")
        
        // RETURNING SUCCESS RESPONSE
        return NextResponse.json({ success: "Signed out successfully"}, { status: 200 })
    }catch(error: unknown){
        if((error as Error).message === "Cannot destructure property '_id' of 'properRequest.storedUser' as it is undefined."){
            eventLogger("401: Unauthorized", "You are not registered in our database, try logging in or signing up", "errorLogs.txt")
            return NextResponse.json({ error:  "You are not registered in our database, try logging in or signing up" }, { status: 401 })
        }

        eventLogger((error as Error).name, (error as Error).message, "errorLogs.txt")
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}