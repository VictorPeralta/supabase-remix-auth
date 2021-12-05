import React, { useEffect } from "react";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { useUser } from "~/useUser";
import { supabase } from "~/supabase";
import { getLoggedInUser } from "~/sessions.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getLoggedInUser(request);
  return user;
};

export default function Index() {
  const { user, session } = useUser();
  const { id: userId } = useLoaderData() || {};

  return (
    <div>
      <h1>Remix + Supabase Auth Starter</h1>

      {user && <p>Your user id from client is: {user.id}</p>}

      {userId && <p>Your user from server is: {userId}</p>}

      {user && <button onClick={() => supabase.auth.signOut()}>logout</button>}

      {!user && (
        <p>
          You're not logged in yet, go <Link to="signup">sign up</Link> or{" "}
          <Link to="login">log in</Link>!
        </p>
      )}
    </div>
  );
}
