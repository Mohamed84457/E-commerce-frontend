"use client"
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
// context
import { useFeedbackweb } from "./page";
const severityColors = {
  success: { bg: "#f6fff8", border: "#81c784" },
  error: { bg: "#fff5f5", border: "#e57373" },
  warning: { bg: "#fff8e1", border: "#ffb74d" },
  info: { bg: "#e3f2fd", border: "#64b5f6" },
};

export function GlobalSnackbar() {
  const { snackbardate, closeSnackbar } = useFeedbackweb();

  const styles = severityColors[snackbardate.type];

  return (
    <Snackbar
      open={snackbardate.open}
      autoHideDuration={snackbardate.duration}
      onClose={closeSnackbar}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      TransitionComponent={Fade}
    >
      <Alert
        severity={snackbardate.type}
        variant="outlined"
        onClose={closeSnackbar}
        sx={{
          bgcolor: styles.bg,
          borderColor: styles.border,
          borderRadius: "12px",
          fontWeight: 500,
        }}
      >
        {snackbardate.message}
      </Alert>
    </Snackbar>
  );
}
