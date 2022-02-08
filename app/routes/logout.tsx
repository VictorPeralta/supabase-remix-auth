import { useEffect } from "react";
import { ActionFunction, LoaderFunction, redirect, useNavigate } from "remix";
import { clearCookie } from "~/sessions.server";
import { supabase } from "~/supabase";
import { useUser } from "~/useUser";

export let action: ActionFunction = async ({ request }): Promise<Response> => {
  return clearCookie(request);
};

export let loader: LoaderFunction = async ({ request }) => {
  console.log("logout loader");

  return clearCookie(request);
};

export default function Logout() {
  console.log("logout route");
  const navigate = useNavigate();
  useUser();

  useEffect(() => {
    const logoutUser = async () => {
      await supabase.auth.signOut();
      navigate("/");
    };
    console.log("signing out");

    logoutUser();
  }, []);
  console.log("render logout");

  return <></>;
}
