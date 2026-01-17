"use client";
import { createContext, useContext, useEffect, useState } from "react";
const Cartitemsnumber = createContext();
export default function Cartitemsnumberprovider({ children }) {
  // cart items number
  const [cartnumber, setcartnumber] = useState(0);
  //   change state
  function changenumberitemsofcart(num) {
    setcartnumber(num);
  }
  // git init number from localstorage
  useEffect(() => {
    const cartitems = JSON.parse(localStorage.getItem("DMTcart")) || [];
    changenumberitemsofcart(cartitems.length);
  }, []);

  return (
    <Cartitemsnumber.Provider value={{ cartnumber, changenumberitemsofcart }}>
      {children}
    </Cartitemsnumber.Provider>
  );
}
export const useCartitemsnumber = () => {
  return useContext(Cartitemsnumber);
};
