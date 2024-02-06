"use client"

import UserContextHook from "@/hooks/UserContextHook";
import {USER_CONTEXT_REDUCER_ACTION_TYPE} from "@/types/Enums"

export default function Home() {
  const {user, error, dispatch} = UserContextHook()

  dispatch({
    type: USER_CONTEXT_REDUCER_ACTION_TYPE.SET_USER,
    payload: { email: "ronniedenzel0@gmail.com" }
  })

  return (
    <div>
      <h1>{user?.email}</h1>
      <p>{user?.userID}</p>
      <p>{error}</p>
    </div>
  );
}
