import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from "./pages/Home";
import UserLogin from './pages/UserLogin';
import UserRegistration from './pages/UserRegistration';
import TicketSuccess from './pages/TicketSuccess';
import './App.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(!!localStorage.getItem("token"));
        };
        // Listen for changes in localStorage to sync auth state across tabs
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // A wrapper for routes that require a user to be logged in
    const ProtectedRoute = ({ children }) => {
        if (!isAuthenticated) {
            // If not authenticated, redirect to the login page
            return <Navigate to="/login" replace />;
        }
        return children;
    };

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/login"
                    // If already authenticated, redirect to home
                    element={isAuthenticated ? <Navigate to="/" /> : <UserLogin setAuth={setIsAuthenticated} />}
                />
                <Route
                    path="/register"
                    element={isAuthenticated ? <Navigate to="/" /> : <UserRegistration setAuth={setIsAuthenticated} /> }
                />

                {/* Protected Routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home setAuth={setIsAuthenticated} isAuthenticated={isAuthenticated} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/confirmation"
                    element={
                        <ProtectedRoute>
                            <TicketSuccess />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;