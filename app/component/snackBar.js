"use client";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
// context
import { useSnackbar } from "../context/snackbarcontext";

export default function CustomizedSnackbars() {
  const {showsnackbar, setshowsnackbar } = useSnackbar();



  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setshowsnackbar({
      ...showsnackbar,
      open: false,
    });
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: showsnackbar.vertical,
          horizontal: showsnackbar.horizontal,
        }}
        open={showsnackbar.open}
        autoHideDuration={showsnackbar.duration}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={showsnackbar.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {showsnackbar.content}
        </Alert>
      </Snackbar>
    </div>
  );
}
