// src/layouts/Auth/Auth.js
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "views/auth/Login.js"; // Your Login component

function Auth() {
    return (
        <div className="auth-layout">
            <div className="auth-content">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Navigate to="/auth/login" replace />} />
                </Routes>
            </div>
        </div>
    );
}

export default Auth;
