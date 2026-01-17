"use client";
import { createContext, useContext, useState } from "react";

const sidebarcontext = createContext();

export default function Sidebarprovider({ children }) {
  // shoe side bar
  const [showsidebar, setshowsidebar] = useState(true);
  return (
    <sidebarcontext.Provider value={{ showsidebar, setshowsidebar }}>
      {children}
    </sidebarcontext.Provider>
  );
}

export const useSidebar = () => {
  return useContext(sidebarcontext);
};
