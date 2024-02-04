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
        const foundUser = await UserSchema.findOne({email}).select("email password _id")

        if(!foundUser){
            eventLogger("400: Bad Request", `User of email ${email} does not exist`, "errorLogs.txt")
            return NextResponse.json({ error: `User of email ${email} does not exist` }, { status: 400 })
        }else if(!(await bcrypt.compare(password, foundUser.password))){
            eventLogger("400: Bad Request", "Invalid password, doesn't match with the one in the database", "errorLogs.txt")
            return NextResponse.json({ error: "Invalid password, doesn't match with the one in the database" }, { status: 400 })
        }

        // IF USER EXISTS, THEN RETURN THE USER AFTER ASSIGNING JWT
        const userID = jwtSign({_id: foundUser._id})
        const loggedUser = {userID, email: foundUser.email}
        eventLogger("200: Success", `User of id ${loggedUser.userID} successfully logged in` , "databaseLogs.txt")
        
        // RETURNING USER WITH USERID TOKEN
        return NextResponse.json({
            success: "Logged in successfully",
            data: loggedUser
        }, { status: 200 })
    }catch(error: unknown){
        eventLogger((error as Error).name, (error as Error).message, "errorLogs.txt")
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}