import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ChildContextData {
  childId: number;
  setChildId: (id: number) => void;
  isLoadingChild: boolean;
}

const ChildContext = createContext<ChildContextData>({} as ChildContextData);

export function ChildProvider({ children }: { children: React.ReactNode }) {
  const [childId, setChildId] = useState<number>(0);
  const [isLoadingChild, setIsLoadingChild] = useState(true);

  useEffect(() => {
    async function loadChild() {
      const storedId = await AsyncStorage.getItem("select_child");
      if (storedId) {
        setChildId(Number(storedId));
      }
      setIsLoadingChild(false);
    }
    loadChild();
  }, []);

  return (
    <ChildContext.Provider value={{ childId, setChildId, isLoadingChild }}>
      {children}
    </ChildContext.Provider>
  );
}

export function useChild() {
  return useContext(ChildContext);
}
