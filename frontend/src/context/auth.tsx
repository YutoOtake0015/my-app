import React, { ReactNode, useContext } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  signin: (token: string) => void;
  signout: () => void;
}

const AuthContext = React.createContext<AuthContextType>({
  signin: () => {},
  signout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const signin = async (token: string) => {
    localStorage.setItem("auth_token", token);
  };

  const signout = () => {
    localStorage.removeItem("auth_token");
  };
  const value = {
    signin,
    signout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
