import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import QueryProvider from "./context/query-provider";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./context/auth-provider";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "./components/ui/sonner";

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <QueryProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <App />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryProvider>
  </ErrorBoundary>
);
