"use client"

// IMPORTING NECESSARY FILES
  // IMPORTING MODULES
import React from "react"
import { useSelector, useDispatch } from "react-redux";
import {useRouter} from "next/navigation"
  // IMPORTING ACTIONS
import { getUser, setUser } from "@/redux/slices/UserContext";
  // IMPORTING TYPES
import { RootState, RootDispatch } from "@/redux/store";
import { User } from "@/types/Types";
  // IMPORTING COMPONENTS
import Form from "@/components/Form"
import Link from "next/link"

// A PAGE FOR THE /AUTH/LOGIN ROUTE
export default function LoginPage(){
  // INSTANTIATING A ROUTER
  const router = useRouter()

  // DEFINING STATES
    // A STATE TO KEEP TRACK OF THE FORMDATA
  const [formData, setFormData] = React.useState<User>({
    email: '',
    password: ''
  })

  // GETTING THE CONTEXT VALUES OF USER FROM THE STORE AND ITS DISPATCH FUNCTION
  const { user, error, loading, success } = useSelector((state: RootState) => state.UserContext);
  const userDispatch = useDispatch<RootDispatch>();

  // A FUNCTION TO HANDLE THE FORMDATA
  function handleFormData(e: React.ChangeEvent<HTMLInputElement>): void{
    const {name, value} = e.target
    setFormData(prevData => ({...prevData, [name]: value}))
  }

  // SETTING THE USER TO THE NEW USER AND VALIDATING THE ROUTE
  React.useEffect(() => {
    userDispatch(getUser());
  }, [userDispatch]);

  // if (user && typeof window !== "undefined") router.push("/home");

  return (
    <section>
      <h1 className="text-bold text-2xl">Welcome, log in</h1>
      
      <Form
        firstInput={{
          name: "email",
          value: formData.email,
          onChange: handleFormData,
          placeholder: "Enter email here"
        }}

        secondInput={{
          name: "password",
          value: formData.password,
          onChange: handleFormData,
          placeholder: "Enter password here"
        }}

        loading={loading}
        
        submitFunction={() => {
          userDispatch(setUser({user: formData, route: "login"}))
          router.push("/home");
        }}
        
        buttonName="Log in"       
      />

      <span>
        Click here to 
        <Link href={'/auth/signup'} className="text-blue-600 underline hover:text-red-500">sign up</Link>
      </span>

      {
        loading
          ?
        <p>Loading...</p>
          :
        (error || success) && <p>{error ?? success}</p>
      }
    </section>
  )
}