import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../redux/hooks";
import { clearNotification } from "../redux/notificationSlice";

const GlobalNotification = () => {
  const dispatch = useDispatch();
  const notificationMessage = useAppSelector(
    (state) => state.notification.message
  );
  const notificationSeverity = useAppSelector(
    (state) => state.notification.severity
  );

  const autoHideDuration = 3000;

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    dispatch(clearNotification());
  };

  return (
    <Snackbar
      open={Boolean(notificationMessage)}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={notificationSeverity ?? "info"}
        sx={{
          fontSize: "1rem",
          width: "100%",
          maxWidth: "600px",
          wordBreak: "break-word",
        }}
      >
        {notificationMessage}
      </Alert>
    </Snackbar>
  );
};

export default GlobalNotification;
