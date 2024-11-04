import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
      light: "#ffffff",
      dark: '#DB4444',
      customBlack: "#191919"
    },
    secondary: {
      main: "#f5f5f5" // Updated to a valid color code
    },
  },
  
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  
  typography: {
    fontFamily: "Poppins, sans-serif",
    h1: {
      fontSize: "clamp(2.5rem, 6vw, 6rem)",
    },
    h2: {
      fontSize: "clamp(2.2rem, 5vw, 3.75rem)",
    },
    h3: {
      fontSize: "clamp(1.7rem, 4.5vw, 3rem)",
    },
    h4: {
      fontSize: "clamp(1.25rem, 3vw, 2.125rem)",
    },
    h5: {
      fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
    },
    h6: {
      fontSize: "clamp(1rem, 2vw, 1.25rem)",
    },
    body1: {
      fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
    },
    body2: {
      fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          overflowX: "hidden", // Prevent horizontal scroll
        },
      },
    },
  },
});

export default theme;
