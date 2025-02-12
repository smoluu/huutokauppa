// AlertPopup.js
"use client";
import { Alert, Snackbar } from "@mui/material";

import useAlert from "../hooks/useAlert";

const AlertPopup = () => {
  const { text, type } = useAlert();

  if (text && type) {
    return (
      <Snackbar open={open} autoHideDuration={6000}>
        <Alert
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {text}
        </Alert>
      </Snackbar>
    );
  } else {
    return <></>;
  }
};

export default AlertPopup;
