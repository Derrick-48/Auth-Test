import React from "react";
import AuthPage from "./auth/AuthPage";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import "./App.css"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<AuthPage type="login" />} />
      <Route path="/signup" element={<AuthPage type="signup" />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
