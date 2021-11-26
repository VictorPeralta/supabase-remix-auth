import React from "react";
import { LoaderFunction, useLoaderData } from "remix";
import { useUser } from "~/auth";

export default function Index() {
  const { userId } = useUser();
  return (
    <div>
      <h1>Remix + Supabase Auth Starter</h1>
      {userId ? (
        <p>Your user id is: {userId}</p>
      ) : (
        <p>You're not logged in yet, go sign up!</p>
      )}
    </div>
  );
}
