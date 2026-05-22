import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextData {
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  signIn: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("@App:token");

        if (!token) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        await AsyncStorage.clear();
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkToken();
  }, []);

  const logout = async () => {
    await AsyncStorage.clear();
    setIsAuthenticated(false);
  };

  const signIn = () => {
    console.log("DEBUG: signIn chamado, autenticando usuário...");
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, logout, signIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
