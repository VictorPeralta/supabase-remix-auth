import { Session } from "@supabase/supabase-js";
import { ActionFunction, redirect } from "remix";
import { createUserSession, clearCookie } from "~/sessions.server";
import { supabase } from "~/supabase";

type AuthEvent =
  | "SIGNED_OUT"
  | "SIGNED_IN"
  | "USER_UPDATED"
  | "PASSWORD_RECOVERY"
  | "TOKEN_REFRESHED";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const authEvent = formData.get("event") as AuthEvent;
  const formSession = formData.get("session");

  if (typeof formSession === "string") {
    const session = JSON.parse(formSession) as Session;
    console.log("auth action", authEvent, session);
    if (authEvent === "SIGNED_IN") {
      return createUserSession(session.access_token);
    }
    if (authEvent === "SIGNED_OUT") {
      return clearCookie(request);
    }
  }
};
