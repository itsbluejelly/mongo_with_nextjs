// IMPORTING NECESSARY TYPES
import {UserType} from "@/types/Types"

// A GUARD TO VALIDATE IF AN OBJECT IS A USER
export function objIsUser(obj: unknown): obj is UserType{
    return typeof obj === "object" && obj !== null &&
    "email" in obj && typeof obj.email === "string"
}