import React, { ReactNode, useContext, useEffect, useState } from "react";
import apiClient from "../lib/apiClient";

interface AuthContextType {
  user: null | {
    id: number;
    username: string;
    email: string;
  };
  signin: (token: string) => void;
  signout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  signin: () => {},
  signout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<null | {
    id: number;
    email: string;
    username: string;
  }>(null);

  useEffect(() => {
    // 認証トークンを取得
    const token = localStorage.getItem("auth_token");
    if (token) {
      apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;

      // トークンに応じたユーザーをセット
      apiClient
        .get("/users/find")
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const signin = async (token: string) => {
    localStorage.setItem("auth_token", token);
    apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;

    // サインイン時、ユーザーをセット
    try {
      apiClient.get("/users/find").then((res) => {
        setUser(res.data.user);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const signout = () => {
    localStorage.removeItem("auth_token");
    delete apiClient.defaults.headers["Authorication"];
    setUser(null);
  };

  const value = {
    user,
    signin,
    signout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};