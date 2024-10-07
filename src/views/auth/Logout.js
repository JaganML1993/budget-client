import { useAuth } from "contexts/AuthContext";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        logout(); // Call the logout method to clear token
        navigate("/auth/login"); // Redirect to login page after logout
    }, [logout, navigate]);

    return null; // No UI needed, redirect will occur
};

export default Logout;
