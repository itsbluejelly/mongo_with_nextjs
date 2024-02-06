// IMPORTING NECESSARY TYPES
import {UserType, NoteType} from "@/types/Types"
import {isValidObjectId} from "mongoose"

// A GUARD TO VALIDATE IF AN OBJECT IS A USER
export function objIsUser(obj: unknown): obj is UserType{
    return typeof obj === "object" && obj !== null &&
    "email" in obj && typeof obj.email === "string"
}

// A GUARD TO VALIDATE IF AN OBJECT IS A NOTE
export function objIsNote(obj: unknown): obj is NoteType{
    return typeof obj === "object" && obj !== null &&
    "title" in obj && typeof obj.title === "string" &&
    "_id" in obj && isValidObjectId(obj._id)
}

// A GUARD TO VALIDATE IF AN ARRAY CONTAINS NOTES
export function arrayHasNotes(array: unknown): array is NoteType[]{
    if(Array.isArray(array) && array.length){
        return array.every(item => (
            typeof item === "object" && item !== null &&
            "title" in item && typeof item.title === "string" &&
            "_id" in item && isValidObjectId(item._id)
        ))
    }

    return false
}