import { createContext, ReactChild, useContext } from "react";

type UserContextType = {
  userId: string;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider = ({
  userId,
  children,
}: UserContextType & { children: ReactChild }) => {
  console.log(userId);

  const value = { userId };
  return <UserContext.Provider value={value} children={children} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};
