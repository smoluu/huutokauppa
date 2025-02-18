"use client";

import React from "react";
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
// Define your theme here
const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000000", // Black background
    },
    primary: {
      main: "#007FFF", // Vibrant purple
    },
    text: {
      primary: "#ffffff", // White text
      secondary: "#b0b0b0", // Light gray text
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "radial-gradient(at 50% 50%, hsla(210, 100%, 60%, 0.5), hsl(220, 30%, 5%))", // Adjust background here
          margin: 0,
          padding: 0,
          fontFamily: "'Georgia', serif", // Global font family for body
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Prevent uppercase text transformation if that's not desired
        },
      },
    },
  },
});

export default function ThemeProvider({ children }) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline /> {/* Resets browser styling */}
      {children}
    </MUIThemeProvider>
  );
}
