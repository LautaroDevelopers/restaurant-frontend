// src/components/Layout.jsx
import React, { useState, useEffect } from 'react';
import { RiMenu2Fill, RiMenu3Fill } from '@remixicon/react';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const [isSidebarVisible, setIsSidebarVisible] = useState(() => {
        const savedState = localStorage.getItem('isSidebarVisible');
        return savedState !== null ? JSON.parse(savedState) : true;
    });

    useEffect(() => {
        localStorage.setItem('isSidebarVisible', JSON.stringify(isSidebarVisible));
    }, [isSidebarVisible]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-blue-600 text-white py-4 shadow-md z-50 fixed top-0 left-0 right-0">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <button
                            onClick={toggleSidebar}
                            className="px-4 py-2 text-white rounded-full hover:font-bold mr-4 flex items-center"
                        >
                            {isSidebarVisible ? <RiMenu3Fill /> : <RiMenu2Fill />}
                        </button>
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                    </div>
                </div>
            </header>
            <main className="flex flex-1 mt-16">
                {isSidebarVisible && (
                    <aside className="w-64 bg-gray-800 text-white p-4 z-40 fixed h-full">
                        <nav>
                            <ul className="space-y-2">
                                <li>
                                    <a href="/dashboard" className="block px-4 py-2 hover:bg-gray-700 rounded">
                                        Inicio
                                    </a>
                                </li>
                                <li>
                                    <a href="/users" className="block px-4 py-2 hover:bg-gray-700 rounded">
                                        Usuarios
                                    </a>
                                </li>
                                <li>
                                    <a href="/profile" className="block px-4 py-2 hover:bg-gray-700 rounded">
                                        Profile
                                    </a>
                                </li>
                                <li>
                                    <a href="/settings" className="block px-4 py-2 hover:bg-gray-700 rounded">
                                        Settings
                                    </a>
                                </li>

                                <li>
                                    <button onClick={handleLogout} className="w-full px-4 py-2 text-start hover:bg-gray-700 rounded">
                                        Cerrar Sesión
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </aside>
                )}
                <section className="flex-1 p-8">
                    {children}
                </section>
            </main>
        </div>
    );
};

export default Layout;
