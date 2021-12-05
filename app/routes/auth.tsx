import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { ActionFunction, redirect } from "remix";
import { createUserSession, clearCookie } from "~/sessions.server";

/** Takes in an AuthChangeEvent and a supabase user session,
 * If auth change event is `SIGNED_IN`, store the session's JWT in a cookie,
 * if it is `SIGNED_OUT`, destroy the session cookie.
 */
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const authEvent = formData.get("event") as AuthChangeEvent;
  const formSession = formData.get("session");

  if (typeof formSession === "string") {
    const session = JSON.parse(formSession) as Session;
    if (authEvent === "SIGNED_IN") {
      return createUserSession(session.access_token);
    }
    if (authEvent === "SIGNED_OUT") {
      return clearCookie(request);
    }
  }
};
