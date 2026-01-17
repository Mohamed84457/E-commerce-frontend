"use client";
import CircularProgress from "@mui/material/CircularProgress";
// context
import { useLoading } from "../context/loadingcontext";
export default function Loading() {
  //show loading
  const { showloading, setshowloading } = useLoading();
  return (
    <CircularProgress
      style={{
        display: showloading ? "" : "none",
        color: "#000",
        position: "fixed",
        top: "50%",
        left: "50%",
      }}
    />
  );
}
