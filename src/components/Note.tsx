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
      <div className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start">
        <div>
          <h2 className="font-bold text-2xl">{props.title}</h2>
          <p>{props.description}</p>
        </div>

        <div className="flex gap-2">
          <button
            className="text-red-400"
            onClick={() => props.deleteAction(props._id)}
            disabled={props.loading}
          >
            <HiOutlineTrash size={24} />
          </button>

          {!props.loading && (
            <Link href={`/home/editTopic/${props._id}`}>
              <HiPencilAlt size={24} />
            </Link>
          )}
        </div>
      </div>
    );
}