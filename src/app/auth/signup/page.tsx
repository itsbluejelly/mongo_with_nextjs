"use client";

// IMPORTING NECESSARY FILES
  // IMPORTING HOOKS
import RootVerifier from "@/hooks/RootVerifier";
  // IMPORTING MODULES
import React from "react"
import { useSelector, useDispatch } from "react-redux";
  // IMPORTING ACTIONS
import { getUser, setUser } from "@/redux/slices/UserContext";
  // IMPORTING TYPES
import { RootState, RootDispatch } from "@/redux/store";
import { User } from "@/types/Types";
  // IMPORTING COMPONENTS
import Form from "@/components/Form"
import Link from "next/link"

// A PAGE FOR THE /AUTH/SIGNUP ROUTE
export default function SignupPage() {
  // DEFINING STATES
  // A STATE TO KEEP TRACK OF THE FORMDATA
  const [formData, setFormData] = React.useState<User>({
    email: "",
    password: "",
  });

  // GETTING THE CONTEXT VALUES OF USER FROM THE STORE AND ITS DISPATCH FUNCTION
  const { user, error, loading, success } = useSelector(
    (state: RootState) => state.UserContext
  );
  const userDispatch = useDispatch<RootDispatch>();

  // A FUNCTION TO HANDLE THE FORMDATA
  function handleFormData(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  // SETTING THE USER TO THE NEW USER AND VALIDATING THE ROUTE
  React.useEffect(() => {
    userDispatch(getUser());
  }, [userDispatch]);

  RootVerifier(user, "/auth");

  return (
    <section>
      <h1 className="text-bold text-2xl">Hello, sign up</h1>

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
        submitFunction={() => setUser({ user: formData, route: "signup" })}
        buttonName="Sign up"
      />

      <span>
        Click here to
        <Link
          href={"/auth/login"}
          className="text-blue-600 underline hover:text-red-500"
        >
          log in
        </Link>
      </span>

      {(error || success) && <p>{error ?? success}</p>}
    </section>
  );
}
