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
import { Note } from "@/models/Note";
    // IMPORTING MODULES
import {isValidObjectId} from "mongoose"

// A GENERIC TYPE TO MAKE ALL PROPERTIES OPTIONAL IN AN OBJECT
export type OptionalGenerator<Type extends Object> = {
    [key in keyof Type]?: Type[key]
}

// A GENERIC TYPE TO OMIT CERTAIN PROPERTIES IN AN OBJECT
export type Omitter<ObjectType extends object, KeyType extends keyof ObjectType> = {
    [key in keyof ObjectType as key extends KeyType ? never : key]: ObjectType[key]
}

// A TYPE FOR THE UPDATE OBJECT
export type UpdateObject = Omitter<OptionalGenerator<Note>, "userID">

// DECLARING A FUNCTION THAT HANDLES ALL PATCH REQUESTS WITHIN THIS ROUTE
export async function PATCH(request: NextRequest){
    try{
        // CHECKING IF THE USER IS AUTHENTICATED
        const properRequest = userVerifier(request) as ProperRequest

        // DESTRUCTURING THE USERID, TITLE AND DESCRIPTION FROM THE REQUEST
        const {_id: userID} = properRequest.storedUser  // NO EFFECT EXCEPT FOR AUTHENTICATION
        const {title, description, _id} = await properRequest.json()

        if(!_id){
            eventLogger("400: Bad Request", "Missing _id property" , "errorLogs.txt")
            return NextResponse.json({ error: "Missing _id property" }, { status: 400 })
        }else if(!isValidObjectId(_id)){
            eventLogger("400: Bad Request", "_id is an invalid value", "errorLogs.txt")
            return NextResponse.json({ error:  "_id is an invalid value" }, { status: 403 })
        }else if(title && typeof title !== "string"){
            eventLogger("400: Bad Request", "Title is invalid, if included it must be a string" , "errorLogs.txt")
            return NextResponse.json({ error: "Title is invalid, if included it must be a string" }, { status: 400 })
        }else if(description && (typeof description !== "string" || description.length > 100 || description.length < 5)){
            eventLogger("400: Bad Request", "Description is invalid, if included it should be a string of between 5-100 letters" , "errorLogs.txt")
            return NextResponse.json({ error: "Description is invalid, if included it should be a string of between 5-100 letters" }, { status: 400 })
        }

        await connectDB()

        // UPDATING THE USER'S NOTE IN THE DATABASE
        const updateObject: UpdateObject = {title, description}
        const updatedNote = await NoteSchema.findByIdAndUpdate(_id, {...updateObject}, { new: true })

        if(updatedNote === null){
            eventLogger("400: Bad request", "This note does not exist", "errorLogs.txt")
            return NextResponse.json({ error:  "This note does not exist" }, { status: 400 })
        }

        // RETURN A SUCCESS JSON RESPONSE IF UPDATE IS SUCCESSFULL
        eventLogger("200: Success", `Note of id ${updatedNote._id} successfully created`, "databaseLogs.txt")

        return NextResponse.json({
            success: "Note created successfully",
            data: updatedNote
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

// DECLARING A FUNCTION THAT HANDLES ALL DELETE REQUESTS WITHIN THIS ROUTE
export async function DELETE(request: NextRequest){
    try{
        // CHECKING IF THE USER IS AUTHENTICATED
        const properRequest = userVerifier(request) as ProperRequest

        // DESTRUCTURING THE ID AND USERID FROM THE REQUEST
        const {_id: userID} = properRequest.storedUser // NO EFFECT EXCEPT FOR AUTHENTICATION
        const {_id} = await properRequest.json()

        if(!_id){
            eventLogger("400: Bad Request", "Missing _id property" , "errorLogs.txt")
            return NextResponse.json({ error: "Missing _id property" }, { status: 400 })
        }else if(!isValidObjectId(_id)){
            eventLogger("400: Bad Request", "_id is an invalid value", "errorLogs.txt")
            return NextResponse.json({ error:  "_id is an invalid value" }, { status: 403 })
        }

        await connectDB()

        // DELETING THE USER'S NOTE FROM THE DATABASE
        const deletedNote = await NoteSchema.findByIdAndDelete(_id)

        if(deletedNote === null){
            eventLogger("400: Bad request", "This note does not exist", "errorLogs.txt")
            return NextResponse.json({ error:  "This note does not exist" }, { status: 400 })
        }

        // RETURN A SUCCESS JSON RESPONSE IF UPDATE IS SUCCESSFULL
        eventLogger("200: Success", `Note of id ${deletedNote._id} successfully deleted`, "databaseLogs.txt")

        return NextResponse.json({
            success: "Note deleted successfully",
            data: deletedNote
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