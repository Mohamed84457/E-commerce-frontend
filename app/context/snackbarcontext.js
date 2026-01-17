"use client";
import { createContext, useContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const snackbarcontext = createContext();

export default function Snackbarprovider({ children }) {
  const [showsnackbar, setshowsnackbar] = useState({
    open: false,
    content: "",
    duration: 5000,
    type: "success",
    vertical: "bottom",
    horizontal: "left",
  });

  const handleClose = () => {
    setshowsnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <snackbarcontext.Provider value={{ showsnackbar, setshowsnackbar }}>
      {children}
      <Snackbar
        open={showsnackbar.open}
        autoHideDuration={showsnackbar.duration}
        onClose={handleClose}
        anchorOrigin={{
          vertical: showsnackbar.vertical,
          horizontal: showsnackbar.horizontal,
        }}
      >
        <MuiAlert
          onClose={handleClose}
          severity={showsnackbar.type}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {showsnackbar.content}
        </MuiAlert>
      </Snackbar>
    </snackbarcontext.Provider>
  );
}

export const useSnackbar = () => {
  return useContext(snackbarcontext);
};
