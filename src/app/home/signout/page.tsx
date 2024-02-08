"use client";

// IMPORTING NECESSARY FILES
  // IMPORTING MODULES
import React from "react"
import { useSelector, useDispatch } from "react-redux";
import {useRouter} from "next/navigation"
  // IMPORTING ACTIONS
import { getUser, deleteUser } from "@/redux/slices/UserContext";
  // IMPORTING TYPES
import { RootState, RootDispatch } from "@/redux/store";
import {User} from "@/types/Types"
  // IMPORTING COMPONENTS
import Form from "@/components/Form"
import Link from "next/link"

// A PAGE FOR THE /HOME/SIGNOUT ROUTE
export default function SignoutPage() {
  // INSTANTIATING A ROUTER
  const router = useRouter();

  // DEFINING STATES
  // A STATE TO KEEP TRACK OF THE FORMDATA
  const [formData, setFormData] = React.useState<User>({
    email: "",
    password: "",
  });

  // A FUNCTION TO HANDLE THE FORMDATA
  function handleFormData(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  // GETTING THE CONTEXT VALUES OF USER FROM THE STORE AND ITS DISPATCH FUNCTION
  const { user, error, loading, success } = useSelector(
    (state: RootState) => state.UserContext
  );
  const userDispatch = useDispatch<RootDispatch>();

  // SETTING THE USER TO THE NEW USER AND VALIDATING THE ROUTE
  React.useEffect(() => {userDispatch(getUser())}, [userDispatch]);

  return user ? (
    <section>
      <h1 className="text-bold text-2xl">Goodbye, sign out</h1>

      <Form
        firstInput={{
          name: "email",
          value: formData.email,
          onChange: handleFormData,
          placeholder: "Enter email here",
        }}
        secondInput={{
          name: "password",
          value: formData.password,
          onChange: handleFormData,
          placeholder: "Enter password here",
        }}
        loading={loading}
        submitFunction={() => {
          userDispatch(deleteUser(formData));
        }}
        buttonName="Sign out"
      />

      <span>
        Click here to
        <Link
          href={"/home"}
          className="text-blue-600 underline hover:text-red-500"
        >
          go back home.
        </Link>
      </span>

      {loading ? (
        <p>Loading...</p>
      ) : (
        (error || success) && <p>{error ?? success}</p>
      )}
    </section>
  ) : (
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
  );
}
