"use client";
import { useState, createContext, useContext } from "react";
const Snackbarcontext = createContext([]);
export default function Customizedwebsidefeedback({ children }) {
  const [snackbardate, setsnackbardata] = useState({
    open: false,
    message: "",
    duration: "5000",
    type: "success",
  });

  const showSnackbar = (message, duration = "5000", type = "success") => {
    setsnackbardata({
      open: true,
      message: message,
      duration: duration,
      type: type,
    });
  };

  const closeSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setsnackbardata((prev) => ({ ...prev, open: false }));
  };

  return (
    <Snackbarcontext.Provider
      value={{ snackbardate, showSnackbar, closeSnackbar }}
    >
      {children}
    </Snackbarcontext.Provider>
  );
}
export const useFeedbackweb = () => {
  return useContext(Snackbarcontext);
};
