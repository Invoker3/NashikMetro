import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from "./pages/Home";
import UserLogin from './pages/UserLogin';
import UserRegistration from './pages/UserRegistration';
import TicketSuccess from './pages/TicketSuccess';
import './App.css'; // We'll create this file for global styles

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token")); // Check if user is logged in

    useEffect(() => {
        const checkAuth = () => setIsAuthenticated(!!localStorage.getItem("token"));
        window.addEventListener("storage", checkAuth); // Detects login/logout across tabs
        return () => window.removeEventListener("storage", checkAuth);
    }, []);

    return (
        <div className="app-wrapper" style={{
            backgroundImage: 'url("/images/subway-background.jpg")', // Update with your actual image path
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            position: 'relative'
        }}>
            <div className="content-overlay" style={{
                backgroundColor: 'rgba(0, 0, 30, 0.7)', // Dark blue-tinted overlay
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0
            }}>
                <div className="content-container" style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: '20px',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Router>
                        <Routes>
                            <Route path="/" element={<Home />} /> {/* Default page */}
                            <Route
                                path="/login"
                                element={isAuthenticated ? <Navigate to="/" /> : <UserLogin />}
                            />
                            <Route
                                path="/register"
                                element={isAuthenticated ? <Navigate to="/" /> : <UserRegistration />}
                            />
                            <Route
                                path="/confirmation"
                                element={<TicketSuccess />}
                            />
                        </Routes>
                    </Router>
                </div>
            </div>
        </div>
    );
};

export default App;