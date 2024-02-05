// IMPORTING NECESSARY FILES
    // IMPORTING MODULES
import mongoose from "mongoose"
import {isEmail} from "validator"
    // IMPORTING TYPES
import {User} from "@/types/Types"

// CREATING A USER SCHEMA FROM THE INSTANCE OF TYPE USER
const UserSchema = new mongoose.Schema<User>({
    email: {
        required: true,
        unique: true,
        type: String,
        
        validate: {
            validator: (email: string) => isEmail(email),
            message: "The email here is invalid"
        }
    },

    password: {
        required: true,
        type: String
    }
})

// EXPORTING A MODEL OF THE USER SCHEMA
export default mongoose.model<User>('User', UserSchema)