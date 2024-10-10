import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import AdminLayout from "layouts/Admin/Admin.js";
import AuthLayout from "layouts/Auth/Auth.js";

import "assets/scss/black-dashboard-react.scss";
import "assets/demo/demo.css";
import "assets/css/nucleo-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import ThemeContextWrapper from "./components/ThemeWrapper/ThemeWrapper";
import BackgroundColorWrapper from "./components/BackgroundColorWrapper/BackgroundColorWrapper";
import { AuthProvider, useAuth } from "./contexts/AuthContext"; // Import useAuth to use the loading state

const App = () => {
  const { isAuthenticated, loading } = useAuth(); // Access loading state and authentication status

  // Show a loading indicator while determining authentication status
  if (loading) {
    return <div>Loading...</div>; // Replace with a better loading indicator if needed
  }

  return (
    <ThemeContextWrapper>
      <BackgroundColorWrapper>
        <BrowserRouter>
          <ToastContainer />
          <Routes>
            {/* Conditionally render based on authentication status */}
            {isAuthenticated ? (
              <>
                {/* Admin routes */}
                <Route path="/admin/*" element={<AdminLayout />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </>
            ) : (
              <>
                {/* Auth routes */}
                <Route path="/auth/*" element={<AuthLayout />} />
                <Route path="*" element={<Navigate to="/auth/login" replace />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </BackgroundColorWrapper>
    </ThemeContextWrapper>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthProvider> {/* Wrap the app with AuthProvider */}
    <App />
  </AuthProvider>
);
