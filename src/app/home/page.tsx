"use client";

// IMPORTING NECESSARY FILES
// IMPORTING HOOKS
import useRootVerifier from "@/hooks/useRootVerifier";

// A PAGE FOR THE /HOME ROUTE
export default function HomePage() {
  useRootVerifier();

  return <h1>Home page, authenticated</h1>;
}
