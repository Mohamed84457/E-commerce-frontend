"use client"
import { createContext, useContext, useState } from "react";

const isuserschangecontext = createContext();

export default function Isuserschangeprovider({ children }) {
  const [isuserchange, setisuserchange] = useState(false);
  return (
    <isuserschangecontext.Provider value={{ isuserchange, setisuserchange }}>
      {children}
    </isuserschangecontext.Provider>
  );
}

export const useIsuserchange = () => {
  return useContext(isuserschangecontext);
};
