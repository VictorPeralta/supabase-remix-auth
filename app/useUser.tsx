import { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  ReactChild,
  useContext,
  useEffect,
  useState,
} from "react";
import { useFetcher, useSubmit } from "remix";
import { supabase } from "./supabase";

type UserContextType = {
  user: User | null;
  session: Session | null;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider = ({ children }: { children: ReactChild }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const fetcher = useFetcher();
  useEffect(() => {
    // On initial load, fetch and set session/user
    const session = supabase.auth.session();
    setSession(session);
    setUser(session?.user ?? null);

    //If auth state changes while user is in the app, set session/auth to new values
    // TODO: Set cookie
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("change", event, session);

        setSession(session);
        setUser(session?.user ?? null);
        fetcher.submit(
          { event, session: JSON.stringify(session) },
          { action: "/auth", method: "post" }
        );
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const value: UserContextType = { user, session };
  return <UserContext.Provider value={value} children={children} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};
