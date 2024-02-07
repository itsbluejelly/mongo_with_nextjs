// IMPORTING NECESSARY FILES
    // IMPORTING TYPES
import {NoteProps} from "@/types/Props"
    // IMPORTING COMPONENTS
import Link from "next/link"    
    // IMPORTING ICONS
import { HiPencilAlt, HiOutlineTrash } from "react-icons/hi"

// A FUNCTION THAT RETURNS A NOTE COMPONENT
export default function Note(props: NoteProps){
    return (
        <div>
            <h2>{props.title}</h2>
            <p>{props.description}</p>

            <div>
                <button 
                    className="text-red-400"
                    onClick={() => props.deleteAction()}
                >
                    <HiOutlineTrash size={24}/>
                </button>
                
                <Link href={`/home/editTopic/${props._id}`}>
                    <HiPencilAlt size={24}/>
                </Link>
            </div>
        </div>
    )
}