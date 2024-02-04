// IMPORTING NECESSARY FILES
    // IMPORTING MIDDLEWARE
import eventLogger from "@/libs/eventLogger";
import userVerifier from "@/libs/userVerifier";
import connectDB from "@/libs/connectDB";
    // IMPORTING MODELS
import NoteSchema from "@/models/Note"
    // IMPORTING SERVER ITEMS
import { NextRequest, NextResponse } from "next/server";
    // IMPORTING TYPES
import { ProperRequest } from "@/libs/userVerifier";

// DECLARING A FUNCTION THAT HANDLES ALL GET REQUESTS WITHIN THIS ROUTE
export async function GET(request: NextRequest){
    try{
        // CHECKING IF THE USER IS AUTHENTICATED
        const properRequest = userVerifier(request) as ProperRequest

        // DESTRUCTURING THE USERID FROM THE REQUEST
        const {_id: userID} = properRequest.storedUser
        await connectDB()

        // FETCHING THE NOTES OF THE USER FROM THE DATABASE
        const foundNotes = await NoteSchema
            .find({userID})
            .select("title description createdAt updatedAt")
            
            .sort({
                updatedAt: "desc",
                createdAt: "desc",
            })

        if(!foundNotes.length){
            eventLogger("400: Bad request", "This user has no notes recorded", "errorLogs.txt")
            return NextResponse.json({ error:  "This user has no notes recorded" }, { status: 400 })
        }

        // IF FOUNDNOTES, RETURN A SUCCESS JSON RESPONSE
        eventLogger("200: Success", `User of id ${userID} fetched notes successfully`, "databaseLogs.txt")

        return NextResponse.json({
            success: "Data fetched successfully",
            data: foundNotes
        }, { status: 200 })
    }catch(error: unknown){
        if((error as Error).message === "Cannot destructure property '_id' of 'properRequest.storedUser' as it is undefined."){
            eventLogger("401: Unauthorized", "You are not registered in our database, try logging in or signing up", "errorLogs.txt")
            return NextResponse.json({ error:  "You are not registered in our database, try logging in or signing up" }, { status: 401 })
        }

        eventLogger((error as Error).name, (error as Error).message, "errorLogs.txt")
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}

// DECLARING A FUNCTION THAT HANDLES ALL POST REQUESTS WITHIN THIS ROUTE
export async function POST(request: NextRequest){
    try{
        // CHECKING IF THE USER IS AUTHENTICATED
        const properRequest = userVerifier(request) as ProperRequest

        // DESTRUCTURING THE USERID, TITLE AND DESCRIPTION FROM THE REQUEST
        const {_id: userID} = properRequest.storedUser
        const {title, description} = await properRequest.json()

        if(!title){
            eventLogger("400: Bad Request", "Missing title property" , "errorLogs.txt")
            return NextResponse.json({ error: "Missing title property" }, { status: 400 })
        }else if(typeof title !== "string"){
            eventLogger("400: Bad Request", "Title is invalid, must be a string" , "errorLogs.txt")
            return NextResponse.json({ error: "Title is invalid, must be a string" }, { status: 400 })
        }else if(description && (typeof description !== "string" || description.length > 100 || description.length < 5)){
            eventLogger("400: Bad Request", "Description is invalid, if included it should be a string of between 5-100 letters" , "errorLogs.txt")
            return NextResponse.json({ error: "Description is invalid, if included it should be a string of between 5-100 letters" }, { status: 400 })
        }

        await connectDB()

        // CREATING THE USER'S NOTE IN THE DATABASE
        const newNote = await NoteSchema.create({userID, title, description})
        eventLogger("201: Created", `Note of id ${newNote._id} successfully created`, "databaseLogs.txt")

        // RETURN A SUCCESS JSON RESPONSE
        return NextResponse.json({
            success: "Note created successfully",
            data: newNote
        }, { status: 201 })
    }catch(error: unknown){
        if((error as Error).message === "Cannot destructure property '_id' of 'properRequest.storedUser' as it is undefined."){
            eventLogger("401: Unauthorized", "You are not registered in our database, try logging in or signing up", "errorLogs.txt")
            return NextResponse.json({ error:  "You are not registered in our database, try logging in or signing up" }, { status: 401 })
        }

        eventLogger((error as Error).name, (error as Error).message, "errorLogs.txt")
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}