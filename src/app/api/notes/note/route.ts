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
import {ProperRequest, UpdateObject} from "@/types/Types";
    // IMPORTING MODULES
import {isValidObjectId} from "mongoose"
    // IMPORTING ENUMS
import {STATUS_CODES} from "@/types/Enums"

// DECLARING A FUNCTION THAT HANDLES ALL PATCH REQUESTS WITHIN THIS ROUTE
export async function PATCH(request: NextRequest){
    try{
        // CHECKING IF THE USER IS AUTHENTICATED
        const properRequest = userVerifier(request) as ProperRequest

        // DESTRUCTURING THE USERID, TITLE AND DESCRIPTION FROM THE REQUEST
        const {_id: userID} = properRequest.storedUser  // NO EFFECT EXCEPT FOR AUTHENTICATION
        const {title, description, _id} = await properRequest.json()

        if(!_id){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad Request`, "Missing _id property" , "errorLogs.txt")
            return NextResponse.json({ error: "Missing _id property" }, { status: STATUS_CODES.BAD_REQUEST })
        }else if(!isValidObjectId(_id)){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad Request`, "_id is an invalid value", "errorLogs.txt")
            return NextResponse.json({ error:  "_id is an invalid value" }, { status: STATUS_CODES.BAD_REQUEST })
        }else if(title && typeof title !== "string"){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad Request`, "Title is invalid, if included it must be a string" , "errorLogs.txt")
            return NextResponse.json({ error: "Title is invalid, if included it must be a string" }, { status: STATUS_CODES.BAD_REQUEST })
        }else if(description && (typeof description !== "string" || description.length > 100 || description.length < 5)){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad Request`, "Description is invalid, if included it should be a string of between 5-100 letters" , "errorLogs.txt")
            return NextResponse.json({ error: "Description is invalid, if included it should be a string of between 5-100 letters" }, { status: STATUS_CODES.BAD_REQUEST })
        }

        await connectDB()

        // UPDATING THE USER'S NOTE IN THE DATABASE
        const updateObject: UpdateObject = {title, description}
        const updatedNote = await NoteSchema.findByIdAndUpdate(_id, {...updateObject}, { new: true })

        if(updatedNote === null){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad request`, "This note does not exist", "errorLogs.txt")
            return NextResponse.json({ error:  "This note does not exist" }, { status: STATUS_CODES.BAD_REQUEST })
        }

        // RETURN A SUCCESS JSON RESPONSE IF UPDATE IS SUCCESSFULL
        eventLogger(`${STATUS_CODES.SUCCESS}: Success`, `Note of id ${updatedNote._id} successfully updated`, "databaseLogs.txt")

        return NextResponse.json({
            success: "Note created successfully",
            data: updatedNote
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

// DECLARING A FUNCTION THAT HANDLES ALL DELETE REQUESTS WITHIN THIS ROUTE
export async function DELETE(request: NextRequest){
    try{
        // CHECKING IF THE USER IS AUTHENTICATED
        const properRequest = userVerifier(request) as ProperRequest

        // DESTRUCTURING THE ID AND USERID FROM THE REQUEST
        const {_id: userID} = properRequest.storedUser // NO EFFECT EXCEPT FOR AUTHENTICATION
        const {_id} = await properRequest.json()

        if(!_id){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad Request`, "Missing _id property" , "errorLogs.txt")
            return NextResponse.json({ error: "Missing _id property" }, { status: STATUS_CODES.BAD_REQUEST })
        }else if(!isValidObjectId(_id)){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad Request`, "_id is an invalid value", "errorLogs.txt")
            return NextResponse.json({ error:  "_id is an invalid value" }, { status: STATUS_CODES.BAD_REQUEST })
        }

        await connectDB()

        // DELETING THE USER'S NOTE FROM THE DATABASE
        const deletedNote = await NoteSchema.findByIdAndDelete(_id)

        if(deletedNote === null){
            eventLogger(`${STATUS_CODES.BAD_REQUEST}: Bad request`, "This note does not exist", "errorLogs.txt")
            return NextResponse.json({ error:  "This note does not exist" }, { status: STATUS_CODES.BAD_REQUEST })
        }

        // RETURN A SUCCESS JSON RESPONSE IF UPDATE IS SUCCESSFULL
        eventLogger(`${STATUS_CODES.SUCCESS}: Success`, `Note of id ${deletedNote._id} successfully deleted`, "databaseLogs.txt")

        return NextResponse.json({
            success: "Note deleted successfully",
            data: deletedNote
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