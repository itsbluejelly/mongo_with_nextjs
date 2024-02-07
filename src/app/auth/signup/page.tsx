"use client";

// IMPORTING NECESSARY FILES
// IMPORTING HOOKS
import useRootVerifier from "@/hooks/useRootVerifier";

// A PAGE FOR THE /AUTH/SIGNUP ROUTE
export default function SignupPage() {
  useRootVerifier();

  return <h1>Signup page, unauthenticated</h1>;
}
