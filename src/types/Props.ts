// IMPORTING NECESSARY FILES
    // IMPORTING TYPES
import {ReactNode} from "react"
import {NoteType} from "@/types/Types"
import { Types } from "mongoose"
    // IMPORTING GENERICS
import {Prettier} from "@/types/Generics"

// DEFINING PROPS FOR THE CONTEXT PROVIDER
export type ContextProviderProps = { children: ReactNode }
// DEFINING PROPS FOR THE NOTE COMPONENT
export type NoteProps = Prettier<NoteType & { deleteAction(userID: Types.ObjectId): void }>