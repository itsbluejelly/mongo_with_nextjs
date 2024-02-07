"use client"

// IMPORTING NECESSARY FILES
  // IMPORT PROVIDERS
import {Provider} from "react-redux"
  // IMPORT STORES
import store from "@/redux/store"
    // IMPORT TYPES
import {ContextProviderProps} from "@/types/Props"

// EXPORTING A COMPONENT THAT PROVIDES THE STORE TO ALL CLIENT BASED PAGES
export default function ContextProvider(props: ContextProviderProps){
    return <Provider store={store}>{props.children}</Provider>
}