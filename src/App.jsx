import React from "react";
import AuthPage from "./auth/AuthPage";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import LandingPage from "./LandingPage"; // Import the new landing page
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import { RepositoryProvider } from "./contexts/RepositoryContext";
import { GitProvider } from "./contexts/GitContext";
import GitRepositoryManager from "./GitRepositoryManager";

export default function App() {
    return (
        <AuthProvider>
            <RepositoryProvider>
                <GitProvider>
                    <MyRoutes />
                </GitProvider>
            </RepositoryProvider>
        </AuthProvider>
    );
}

const MyRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} /> {/* Changed this line */}
            <Route path="/login" element={<AuthPage type="login" />} />
            <Route path="/git-repository-manager" element={<GitRepositoryManager />} />
            <Route path="/signup" element={<AuthPage type="signup" />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    );
};