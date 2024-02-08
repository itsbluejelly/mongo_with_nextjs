"use client";

// IMPORTING NECESSARY FILES
  // IMPORTING MODULES
import React from "react"
import { useSelector, useDispatch } from "react-redux";
import {useRouter} from "next/navigation"
  // IMPORTING ACTIONS
import { getUser } from "@/redux/slices/UserContext";
import { setNotes, deleteNote } from "@/redux/slices/NotesContext";
  // IMPORTING TYPES
import { RootState, RootDispatch } from "@/redux/store";
import { NotesFetch } from "@/types/Types";
import {Types} from "mongoose"
  // IMPORTING COMPONENTS
import Note from "@/components/Note"
import Link from "next/link"

// A PAGE FOR THE /HOME ROUTE
export default function HomePage() {
  // INSTANTIATING A ROUTER
  const router = useRouter();

  // DEFINING STATES
  // A STATE FOR THE NOTES ERROR AND LOADING STATES DURING FETCH
  const [notesFetch, setNotesFetch] = React.useState<NotesFetch>({
    error: "",
    loading: false,
    success: "",
  });

  // GETTING THE CONTEXT VALUES FROM THE STORE AND ITS DISPATCH FUNCTION
  // USER
  const {
    user,
    error: userError,
    loading: userLoading,
    success: userSuccess,
  } = useSelector((state: RootState) => state.UserContext);

  const dispatch = useDispatch<RootDispatch>();

  // NOTES
  const { notes, error: notesError } = useSelector(
    (state: RootState) => state.NotesContext
  );

  // A FUNCTION TO FETCH THE NOTES FROM THE API
  const fetchNotes: () => Promise<void> = React.useCallback(async () => {
    setNotesFetch({
      loading: true,
      error: "",
      success: "",
    });

    try {
      const response: Response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notes`
      );
      const { success, data, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      dispatch(setNotes(data));

      setNotesFetch({
        error: "",
        loading: false,
        success: success as string,
      });
    } catch (error: unknown) {
      setNotesFetch({
        error: (error as Error).message,
        loading: false,
        success: "",
      });
    }
  }, [dispatch]);

  // A FUNCTION TO DELETE THE NOTE FROM THE API
  const deleteHandler: (noteID: Types.ObjectId) => Promise<void> =
    React.useCallback(
      async (noteID) => {
        setNotesFetch({
          loading: true,
          error: "",
          success: "",
        });

        try {
          const response: Response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/notes/note`,
            {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ _id: noteID }),
            }
          );

          const { success, data, error } = await response.json();

          if (error) {
            throw new Error(error);
          }

          dispatch(deleteNote(data));

          setNotesFetch({
            error: "",
            loading: false,
            success: success as string,
          });
        } catch (error: unknown) {
          setNotesFetch({
            error: (error as Error).message,
            loading: false,
            success: "",
          });
        }
      },
      [dispatch]
    );

  // A FUNCTION TO MAP THROUGH THE OBTAINED NOTES
  function notesArrayGenerator(): JSX.Element[] {
    return notes.map((note) => (
      <Note
        key={`${note._id}`}
        title={note.title}
        description={note.description}
        _id={note._id}
        deleteAction={deleteHandler}
        loading={notesFetch.loading || userLoading}
      />
    ));
  }

  // SETTING THE USER TO THE NEW USER AND VALIDATING THE ROUTE
  React.useEffect(() => {dispatch(getUser());}, [dispatch]);

  // CALLING THE FETCHNOTES FUNCTION VIA USEEFFECT
  React.useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return !user 
      ?
    <p>
      Sorry, but you are not authenticated, click
      
      <Link
        href={"/auth/login"}
        className="text-blue-600 underline hover:text-red-500"
      >
        log in
      
      </Link>
      
      or
      
      <Link
        href={"/auth/signup"}
        className="text-blue-600 underline hover:text-red-500"
      >
        sign up
      </Link>
    </p> 
      :
    notesFetch.error || userError || notesError ? (
      <p>{notesFetch.error ?? userError ?? notesError}</p>
    ) : notesFetch.loading || userLoading ? (
      <p>Loading...</p>
    ) : (
      <>
        <section>{notesArrayGenerator()}</section>

        <span>
          Click here to 
          <Link href="/home/signout" className="text-blue-600 underline hover:text-red-500">Sign out</Link>
          .
        </span>
        
        {(notesFetch.success || userSuccess) && (
          <p>{notesFetch.success ?? userSuccess}</p>
        )}
      </>
    )
}
