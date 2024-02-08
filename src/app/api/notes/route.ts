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
import { ProperRequest } from "@/types/Types";
    // IMPORTING ENUMS
import {STATUS_CODES} from "@/types/Enums"

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
            .select("title description createdAt updatedAt _id")
            
            .sort({
                updatedAt: "desc",
                createdAt: "desc",
            })

        if(!foundNotes.length){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad request`, "This user has no notes recorded", "errorLogs.txt")
            return NextResponse.json({ error:  "This user has no notes recorded" }, { status: STATUS_CODES.BAD_REQUEST })
        }

        // IF FOUNDNOTES, RETURN A SUCCESS JSON RESPONSE
        eventLogger(`${STATUS_CODES.SUCCESS}: Success`, `User of id ${userID} fetched notes successfully`, "databaseLogs.txt")

        return NextResponse.json({
            success: "Data fetched successfully",
            data: foundNotes
        }, { status: STATUS_CODES.SUCCESS })
    }catch(error: unknown){
        if((error as Error).message === "Cannot destructure property '_id' of 'properRequest.storedUser' as it is undefined." || "Cannot destructure property '_id' of 'r.storedUser' as it is undefined."){
            eventLogger(`${STATUS_CODES.UNAUTHORIZED}: Unauthorized`, "You are not registered in our database, try logging in or signing up", "errorLogs.txt")
            return NextResponse.json({ error:  "You are not registered in our database, try logging in or signing up" }, { status: STATUS_CODES.UNAUTHORIZED })
        }

        eventLogger((error as Error).name, (error as Error).message, "errorLogs.txt")
        return NextResponse.json({ error: (error as Error).message }, { status: STATUS_CODES.INTERNAL_SERVER_ERROR })
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
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad Request`, "Missing title property" , "errorLogs.txt")
            return NextResponse.json({ error: "Missing title property" }, { status: STATUS_CODES.BAD_REQUEST })
        }else if(typeof title !== "string"){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad Request`, "Title is invalid, must be a string" , "errorLogs.txt")
            return NextResponse.json({ error: "Title is invalid, must be a string" }, { status: STATUS_CODES.BAD_REQUEST })
        }else if(description && (typeof description !== "string" || description.length > 100 || description.length < 5)){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad Request`, "Description is invalid, if included it should be a string of between 5-100 letters" , "errorLogs.txt")
            return NextResponse.json({ error: "Description is invalid, if included it should be a string of between 5-100 letters" }, { status: STATUS_CODES.BAD_REQUEST })
        }

        await connectDB()

        // CREATING THE USER'S NOTE IN THE DATABASE
        const newNote = await NoteSchema.create({userID, title, description})
        eventLogger(`${STATUS_CODES.CREATED}: Created`, `Note of id ${newNote._id} successfully created`, "databaseLogs.txt")

        // RETURN A SUCCESS JSON RESPONSE
        return NextResponse.json({
            success: "Note created successfully",
            data: newNote
        }, { status: STATUS_CODES.CREATED })
    }catch(error: unknown){
        if((error as Error).message === "Cannot destructure property '_id' of 'properRequest.storedUser' as it is undefined." || "Cannot destructure property '_id' of 'r.storedUser' as it is undefined."){
            eventLogger(`${STATUS_CODES.UNAUTHORIZED}: Unauthorized`, "You are not registered in our database, try logging in or signing up", "errorLogs.txt")
            return NextResponse.json({ error:  "You are not registered in our database, try logging in or signing up" }, { status: STATUS_CODES.UNAUTHORIZED })
        }

        eventLogger((error as Error).name, (error as Error).message, "errorLogs.txt")
        return NextResponse.json({ error: (error as Error).message }, { status: STATUS_CODES.INTERNAL_SERVER_ERROR })
    }
}