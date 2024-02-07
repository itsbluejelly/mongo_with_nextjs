"use client"

// IMPORTING NECESSARY FILES
  // IMPORTING HOOKS
import RootVerifier from "@/hooks/RootVerifier";
  // IMPORTING MODULES
import React from "react"
import { useSelector, useDispatch } from "react-redux";
  // IMPORTING ACTIONS
import { getUser } from "@/redux/slices/UserContext";
  // IMPORTING TYPES
import { RootState, RootDispatch } from "@/redux/store";

// A PAGE FOR THE /AUTH/LOGIN ROUTE
export default function LoginPage(){
  // GETTING THE CONTEXT VALUES OF USER FROM THE STORE AND ITS DISPATCH FUNCTION
  const { user, error, loading, success } = useSelector((state: RootState) => state.UserContext);
  const userDispatch = useDispatch<RootDispatch>();

  // SETTING THE USER TO THE NEW USER AND VALIDATING THE ROUTE
  React.useEffect(() => {
    userDispatch(getUser());
  }, [userDispatch]);
  
  RootVerifier(user, "/auth");

  return error || loading ? (
    <h1>{loading ? "loading..." : error}</h1>
  ) : (
    <h1>Login page, unauthenticated</h1>
  );
}