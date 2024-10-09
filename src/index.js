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
import Loader from "./components/Loader"; // Import the Loader component

const App = () => {
  const { loading } = useAuth(); // Access loading state from AuthContext

  if (loading) {
    return <Loader />; // Show loader while the app is in the loading state
  }

  return (
    <ThemeContextWrapper>
      <BackgroundColorWrapper>
        <BrowserRouter>
          <ToastContainer />
          <Routes>
            {/* Admin routes */}
            <Route path="/admin/*" element={<AdminLayout />} />

            {/* Auth routes */}
            <Route path="/auth/*" element={<AuthLayout />} />

            {/* Default route */}
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
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
