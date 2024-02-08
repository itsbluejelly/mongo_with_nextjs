"use client";

// IMPORTING NECESSARY FILES
  // IMPORTING HOOKS
import RootVerifier from "@/hooks/RootVerifier";
  // IMPORTING MODULES
import React from "react"
import { useSelector, useDispatch } from "react-redux";
  // IMPORTING ACTIONS
import { getUser } from "@/redux/slices/UserContext";
import { addNote } from "@/redux/slices/NotesContext";
  // IMPORTING TYPES
import { RootState, RootDispatch } from "@/redux/store";
import { AddTopicFormData, NotesFetch, AddObject } from "@/types/Types";
  // IMPORTING COMPONENTS
import Form from "@/components/Form"
import Link from "next/link";

// A PAGE FOR THE /HOME/ADDTOPIC ROUTE
export default function AddTopicPage() {
  // DEFINING STATES
  // DEFINING A STATE FOR THE FORMDATA
  const [formData, setFormData] = React.useState<AddTopicFormData>({
    title: "",
    description: "",
  });

  // A STATE FOR THE NOTE ERROR AND LOADING STATES DURING FETCH
  const [noteFetch, setNoteFetch] = React.useState<NotesFetch>({
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
  const { error: notesError } = useSelector(
    (state: RootState) => state.NotesContext
  );

  // A FUNCTION USED TO MANAGE THE FORMDATA
  function handleFormData(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  // A FUNCTION TO CONVERT THE FORMDATA TO A NOTE OBJECT
  function convertFormData(formData: AddTopicFormData): AddObject | AddTopicFormData | undefined{
    const {title, description} = formData

    if(!description && title){
      return {title}
    }else if(title && description){
      return formData
    }else{
      setNoteFetch({
        error: "Please fill the data on the title property",
        loading: false,
        success: ""
      })
    }
  }

  // A FUNCTION USED TO ADD A NEW USER TO THE DATABASE
  const addHandler: (note: AddObject | void) => Promise<void> =
    React.useCallback(
      async (note) => {
        if(!note || note === null){
          return setNoteFetch({
            loading: false,
            error: "No note is provided for addition to the database",
            success: "",
          });
        }
        
        setNoteFetch({
          loading: true,
          error: "",
          success: "",
        });

        try {
          const response: Response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/notes/note`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({...note}),
            }
          );

          const { success, data, error } = await response.json();

          if (error) {
            throw new Error(error);
          }

          dispatch(addNote(data));

          setNoteFetch({
            error: "",
            loading: false,
            success: success as string,
          });
        } catch (error: unknown) {
          setNoteFetch({
            error: (error as Error).message,
            loading: false,
            success: "",
          });
        }
      },
      
      [dispatch]
    );

  // SETTING THE USER TO THE NEW USER AND VALIDATING THE ROUTE
  React.useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  RootVerifier(user, "/home");

  return (
    <section>
      <h1 className="text-bold text-2xl">Add a note</h1>

      <Form
        firstInput={{
          name: "title",
          value: formData.title,
          onChange: handleFormData,
          placeholder: "Enter title here",
        }}
        secondInput={{
          name: "description",
          value: formData.description,
          onChange: handleFormData,
          placeholder: "Enter description here",
        }}
        loading={userLoading || noteFetch.loading}
        submitFunction={() => addHandler(convertFormData(formData))}
        buttonName="Add Note"
      />

      <span>
        Click here to
        <Link
          href={"/home"}
          className="text-blue-600 underline hover:text-red-500"
        >
          go back home
        </Link>
      </span>

      {(noteFetch.loading || userLoading) && <p>Loading...</p>}
      {(noteFetch.error || userError || notesError) && <p>{noteFetch.error ?? userError ?? notesError}</p>}
      {(noteFetch.success || userSuccess) && <p>{noteFetch.success ?? userSuccess}</p>}
    </section>
  );
}
