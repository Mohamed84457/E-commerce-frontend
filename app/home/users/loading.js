import CircularProgress from "@mui/material/CircularProgress";

export default function userloading() {
  return (
    <CircularProgress
      style={{
        color: "#000",
        position: "fixed",
        top: "50%",
        left: "50%",
      }}
    />
  );
}
