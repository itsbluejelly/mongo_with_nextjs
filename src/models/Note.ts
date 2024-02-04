// IMPORTING NECESSARY FILES
    // IMPORTING MODULES
import mongoose from "mongoose"
    // IMPORTING TYPES
import {Types} from "mongoose"

// A TYPE FOR THE NOTE MODEL
export type Note = {
    userID: Types.ObjectId,
    title: string
    description?: string
}

// CREATING A NOTE SCHEMA FROM THE INSTANCE OF TYPE NOTE
const NoteSchema = new mongoose.Schema<Note>({
    userID: {
        required: true,
        type: "ObjectID"
    },

    title: {
        required: true,
        type: String
    },

    description: { 
        type: String,
        minLength: 5, 
        maxLength: 100, 
    }
}, { timestamps: true })

// EXPORTING A MODEL OF THE NOTE SCHEMA
export default mongoose.model<Note>('Note', NoteSchema)