import { User } from "@supabase/supabase-js";
import { createCookieSessionStorage, json, redirect } from "remix";
import { supabase } from "./supabase";

let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

//TODO: Get this options from env
let storage = createCookieSessionStorage({
  cookie: {
    name: "APP_SESSION",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(accessToken: string) {
  let cookie = await storage.getSession();
  cookie.set("accessToken", accessToken);

  return json(null, {
    headers: {
      "Set-Cookie": await storage.commitSession(cookie),
    },
  });
}

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getLoggedInUser(request: Request): Promise<User | null> {
  let session = await getUserSession(request);

  let accessToken = session.get("accessToken");
  console.log("getLogged", accessToken);
  if (!accessToken || typeof accessToken !== "string") return null;
  const { user } = await supabase.auth.api.getUser(accessToken);
  return user;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  let session = await getUserSession(request);
  let userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function clearCookie(request: Request) {
  let session = await storage.getSession(request.headers.get("Cookie"));
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
