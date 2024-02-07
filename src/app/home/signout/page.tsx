"use client";

// IMPORTING NECESSARY FILES
// IMPORTING HOOKS
import useRootVerifier from "@/hooks/useRootVerifier";

// A PAGE FOR THE /HOME/SIGNOUT ROUTE
export default function SignoutPage() {
  useRootVerifier();

  return <h1>Signout page, authenticated</h1>;
}
