// IMPORTING NECESSARY FILES
    // IMPORTING MODULES
import {createSlice} from "@reduxjs/toolkit";
    // IMPORTING TYPES
import {NotesContextReducerStateType, NoteType, NotesContextReducerActionType, AuthResponseValues} from "@/types/Types";
    // IMPORTING GUARDS
import {arrayHasNotes, objIsNote} from "@/types/Guards"

// DEFINING THE INITIAL STATE OF THE NOTES CONTEXT
const initialState: NotesContextReducerStateType = {
    notes: [],
    error: ''
}

// DEFINING A SLICE OF THE STORE CONTAINING THE NOTESCONTEXT ACTIONS AND STATE
const notesContextSlice = createSlice({
    name: "notesContextReducer",
    initialState,

    reducers: {
        setNotes: (state: NotesContextReducerStateType, {payload: notes}: NotesContextReducerActionType["SET_NOTES"]): NotesContextReducerStateType => {
            if(!arrayHasNotes(notes)){
                return {...state, error: "The notes data is not of the required type", notes: []}
            }

            return {
              ...state,
              error: "",
              notes,
            };
        },

        deleteNote: (state: NotesContextReducerStateType, {payload: deletedNote}: NotesContextReducerActionType["DELETE_NOTE"]): NotesContextReducerStateType => {
            if(!objIsNote(deletedNote)){
                return {...state, error: "The deleted note is not of the required type"}
            }

            const filteredNotes: NoteType[] = state.notes.filter(note => note._id !== deletedNote._id)

            return {
              ...state,
              error: "",
              notes: filteredNotes,
            };
        },

        addNote: (state: NotesContextReducerStateType, {payload: newNote}: NotesContextReducerActionType["ADD_NOTE"]): NotesContextReducerStateType => {
            if(!objIsNote(newNote)){
                return {...state, error: "The new note is not of the required type"}
            }

            return {
              ...state,
              error: "",
              notes: [newNote, ...state.notes],
            };
        },

        editNote: (state: NotesContextReducerStateType, {payload: editedNote}: NotesContextReducerActionType["ADD_NOTE"]): NotesContextReducerStateType => {
            if(!objIsNote(editedNote)){
                return {...state, error: "The edited note is not of the required type"}
            }

            const updatedNotes: NoteType[] = state.notes.map(note => note._id === editedNote._id ? editedNote : note)

            return {
              ...state,
              error: "",
              notes: updatedNotes,
            };
        },
    },
})

// EXPORT THE ACTIONS AND REDUCER FROM THE SLICE
const NotesContextReducer = notesContextSlice.reducer
export const {addNote, deleteNote, editNote, setNotes} = notesContextSlice.actions
export default NotesContextReducer