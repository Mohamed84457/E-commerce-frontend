"use client";
import { createContext, useContext, useState } from "react";

const loadingcontext = createContext();

export default function Loadingprovider({ children }) {
  const [showloading, setshowloading] = useState(false);
  return (
    <loadingcontext.Provider value={{ showloading, setshowloading }}>
      {children}
    </loadingcontext.Provider>
  );
}

export const useLoading = () => {
  return useContext(loadingcontext);
};
