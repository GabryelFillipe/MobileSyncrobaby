import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  photo: string;
}

interface AuthContextData {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  logout: () => void;
  signIn: (userData: User) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("@App:token");

        if (!token) {
          setIsAuthenticated(false);
          setUser(null);
        } else {
          const name = await AsyncStorage.getItem("user_name");
          const email = await AsyncStorage.getItem("user_email");
          const photo = await AsyncStorage.getItem("user_photo");
          const id = await AsyncStorage.getItem("user_id_guardian");

          setUser({
            name: name || "",
            email: email || "",
            photo: photo || "",
            id: id ? Number(id) : 0,
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        await AsyncStorage.clear();
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkToken();
  }, []);

  const logout = async () => {
    await AsyncStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
  };

  const signIn = (userData: User) => {
    console.log(
      "DEBUG: signIn chamado, autenticando usuário e salvando estado...",
    );
    setUser(userData);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, logout, signIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
