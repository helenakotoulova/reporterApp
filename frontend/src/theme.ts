import { createTheme } from "@mui/material";

export const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "1.1rem",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "1.1rem",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: "1.5rem",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          fontSize: "1.3rem",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          fontSize: "1.2rem",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontSize: "1.2rem",
        },
      },
    },
  },
});
