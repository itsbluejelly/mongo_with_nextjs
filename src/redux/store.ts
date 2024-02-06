// IMPORTING NECESSARY FILES
    // IMPORTING MODULES
import { configureStore } from "@reduxjs/toolkit";
    // IMPORTING REDUCERS
import UserContextReducer from "./slices/UserContext";
import NotesContextReducer from "./slices/NotesContext";
    // IMPORTING GENERICS
import { FindReturn } from "@/types/Generics";

// CREATING A STORE
const store = configureStore({
    reducer: {
        "UserContext": UserContextReducer,
        "NotesContext": NotesContextReducer,
    }
})

// CREATING AND EXPORTING CERTAIN TYPES
export type RootState = FindReturn<typeof store.getState>
export type RootDispatch = typeof store.dispatch
export default store