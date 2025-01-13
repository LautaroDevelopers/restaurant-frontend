import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import LandingPage from "./pages/LandingPage";
import MenuPage from "./pages/MenuPage";
import WaiterDashboard from "./pages/WaiterDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Forbidden from "./components/Forbidden";
import Orders from "./pages/Orders";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/users" element={<ProtectedRoute requiredRole="Administrador"><Layout><UsersPage /></Layout></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Layout><SettingsPage /></Layout></ProtectedRoute>} />
                <Route path="/carta" element={<MenuPage />} />
                <Route path="/orders" element={<ProtectedRoute requiredRole="Cocina"><Layout><Orders /></Layout></ProtectedRoute>} />
                <Route path="/pedir" element={<ProtectedRoute><Layout><WaiterDashboard /></Layout></ProtectedRoute>} />
                <Route path="/unauthorized" element={<Forbidden messaje="No tienes permiso para acceder a esta página"/>} />
            </Routes>
        </Router>
    );
}

export default App;
