"use client"
import { createContext, useContext, useState } from "react";

const userdatacontext = createContext();

export default function Userdataprovider({ children }) {
  const [userdata, setuserdata] = useState({
    token: "",
    user: {
      name: "",
      email: "",
    },
  });
  return (
    <userdatacontext.Provider value={{ userdata, setuserdata }}>
      {children}
    </userdatacontext.Provider>
  );
}

export const useUserdata = () => {
  return useContext(userdatacontext);
};
