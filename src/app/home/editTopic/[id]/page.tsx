"use client";

// IMPORTING NECESSARY FILES
// IMPORTING MODULES
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
// IMPORTING ACTIONS
import { getUser } from "@/redux/slices/UserContext";
import { editNote } from "@/redux/slices/NotesContext";
// IMPORTING TYPES
import { RootState, RootDispatch } from "@/redux/store";
import { AddTopicFormData, NotesFetch, UpdateObject } from "@/types/Types";
// IMPORTING COMPONENTS
import Form from "@/components/Form";
import Link from "next/link";

// A PAGE FOR THE /HOME/EDITTOPIC/[ID] ROUTE
export default function EditTopicPage(){
  // GETTING THE ID PARAMETER AND ROUTER
  const queryParams = new URLSearchParams();
  const _id = queryParams.get("id");

  const router = useRouter();
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

  // A STATE TO FLAG THAT THE FIRST USER HAS ALREADY BEEN FETCHED
  const [foundInitialUser, setFoundInitialUser] =
    React.useState<boolean>(false);

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

  // A FUNCTION TO CONVERT THE FORMDATA TO AN UPDATE NOTE OBJECT
  function convertFormData(formData: AddTopicFormData): UpdateObject | void {
    const { title, description } = formData;

    if (!description && title) {
      return { title };
    } else if (title && description) {
      return formData;
    } else if (description && !title) {
      return { description };
    } else return;
  }

  // A FUNCTION USED TO EDIT A NEW USER TO THE DATABASE
  const editHandler: (note: UpdateObject | void) => Promise<void> =
    React.useCallback(
      async (note) => {
        if (!note || note === null) return;

        setNoteFetch({
          loading: true,
          error: "",
          success: "",
        });

        try {
          const response: Response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/notes/note`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...note, _id }),
            }
          );

          const { success, data, error } = await response.json();

          if (error) {
            throw new Error(error);
          }

          dispatch(editNote(data));

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

      [dispatch, _id]
    );

  // SETTING THE USER TO THE NEW USER AND VALIDATING THE ROUTE
  React.useEffect(() => {dispatch(getUser());}, [dispatch]);
  React.useEffect(() => {
    if (user) setFoundInitialUser(true);
  }, [user]);

  React.useEffect(() => {
    if (foundInitialUser) router.push("/auth/login");
  }, [router, foundInitialUser]);

  return (
    <section>
      <h1 className="text-bold text-2xl">Edit a note</h1>

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
        submitFunction={() => editHandler(convertFormData(formData))}
        buttonName="Edit Note"
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

      {noteFetch.loading || userLoading ? (
        <p>Loading...</p>
      ) : noteFetch.error || userError || notesError ? (
        <p>{noteFetch.error ?? userError ?? notesError}</p>
      ) : (
        noteFetch.success ||
        (userSuccess && <p>{noteFetch.success ?? userSuccess}</p>)
      )}
    </section>
  );
}
