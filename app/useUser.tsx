import { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import {
  createContext,
  ReactChild,
  useContext,
  useEffect,
  useState,
} from "react";
import { useFetcher } from "remix";
import { supabase } from "./supabase";

type UserContextType = {
  user: User | null;
  session: Session | null;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * This context provides user/session details.
 * It handles auth state changes and sets a cookie for server-side rendering (SSR) when session changes.
 */
export const UserContextProvider = ({ children }: { children: ReactChild }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const fetcher = useFetcher();

  const fetchSessionCookie = (
    event: AuthChangeEvent,
    session: Session | null
  ) => {
    //We only want to create or destroy cookie when session exists and sign in/sign out occurs
    if (event === "SIGNED_IN" || event === "SIGNED_OUT")
      fetcher.submit(
        { event, session: JSON.stringify(session) },
        { action: "/auth", method: "post" }
      );
  };

  useEffect(() => {
    //If auth state changes while user is in the app, set session/auth to new values
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("listener", event);

        setSession(session);
        setUser(session?.user ?? null);
        fetchSessionCookie(event, session);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // On initial load, recover session from local storage and store in state
    const session = supabase.auth.session();
    setSession(session);
    setUser(session?.user ?? null);
    console.log("session recovered");

    // If session exists by now, set a cookie when app is reloaded, in case session was expired while app wasn't open
    // because session recovering/refreshing now happens on supabase constructor, before any onAuthStateChange events are emitted.
    if (session) fetchSessionCookie("SIGNED_IN", session);
  }, []);

  const value: UserContextType = { user, session };
  return <UserContext.Provider value={value} children={children} />;
};

/**
 * Gets user/session details stored in UserContext
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};
