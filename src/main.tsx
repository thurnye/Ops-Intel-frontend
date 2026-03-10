import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { store } from "@app/stores/stores";
import { AppRouter } from "@app/routes/AppRouter";
import { useAuthBootstrap } from "@features/auth/hooks/useAuthBootstrap";
import "./index.css";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#6366f1" },
    secondary: { main: "#0f172a" },
    background: { default: "#f8fafc", paper: "#ffffff" },
    text: { primary: "#0f172a", secondary: "#64748b" },
    divider: "#e2e8f0"
  },
  typography: {
    fontFamily: "\"Inter\", \"Segoe UI\", Roboto, sans-serif",
    h4: { fontWeight: 700, fontSize: "1.75rem", letterSpacing: "-0.025em" },
    h5: { fontWeight: 700, fontSize: "1.25rem", letterSpacing: "-0.02em" },
    h6: { fontWeight: 600, fontSize: "1rem", letterSpacing: "-0.01em" },
    body2: { fontSize: "0.875rem", color: "#64748b" },
    button: { textTransform: "none", fontWeight: 600 }
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
          border: "1px solid #e2e8f0",
          backgroundImage: "none"
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          backgroundImage: "none"
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 20px",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" }
        },
        contained: {
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6366f1"
            }
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            fontWeight: 600,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "#64748b",
            borderBottom: "2px solid #e2e8f0",
            backgroundColor: "#f8fafc"
          }
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": { borderBottom: 0 },
          "&.MuiTableRow-hover:hover": {
            backgroundColor: "#f8fafc"
          }
        }
      }
    }
  }
});

function Bootstrapper() {
  useAuthBootstrap();
  return <AppRouter />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              background: "#ffffff",
              color: "#0f172a"
            }
          }}
        />
        <BrowserRouter>
          <Bootstrapper />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
