import React, { useState, useEffect } from 'react';
import { RiMenu2Fill, RiMenu3Fill, RiLogoutBoxLine } from '@remixicon/react';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [ isSidebarVisible, setIsSidebarVisible ] = useState(() => {
        const savedState = localStorage.getItem('isSidebarVisible');
        return savedState !== null ? JSON.parse(savedState) : true;
    });
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        localStorage.setItem('isSidebarVisible', JSON.stringify(isSidebarVisible));
    }, [ isSidebarVisible ]);

    useEffect(() => {
        setIsSidebarVisible(false);
    }, [ location ]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    return (
        <div className="dashboard flex flex-col min-h-screen bg-gray-900 overflow-hidden">
            <header className="bg-gray-800 text-white py-4 shadow-md z-50 fixed top-0 left-0 right-0">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <button
                            onClick={toggleSidebar}
                            className="px-4 py-2 text-white hover:font-bold mr-4 flex items-center"
                        >
                            {isSidebarVisible ? <RiMenu3Fill /> : <RiMenu2Fill />}
                        </button>
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                    </div>
                </div>
            </header>
            <div className="flex flex-1 mt-16 relative overflow-hidden">
                {isSidebarVisible && (
                    <aside className="w-64 bg-gray-800/70 text-white p-4 absolute top-0 left-0 bottom-0">
                        <nav>
                            <ul className="space-y-2">
                                <li>
                                    <a href="/dashboard" className="block px-4 py-2 hover:bg-gray-700 rounded">
                                        Inicio
                                    </a>
                                </li>
                                {userRole === 'Administrador' && (
                                    <>
                                        <li>
                                            <a href="/users" className="block px-4 py-2 hover:bg-gray-700 rounded">
                                                Usuarios
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/dishes" className="block px-4 py-2 hover:bg-gray-700 rounded">
                                                Platos
                                            </a>
                                        </li>
                                    </>
                                )}
                                {(userRole === 'Administrador' || userRole === 'Mozo') && (
                                    <li>
                                        <a href="/tables" className="block px-4 py-2 hover:bg-gray-700 rounded">
                                            Mesas
                                        </a>
                                    </li>
                                )}
                                {(userRole === 'Administrador' || userRole === 'Cocina') && (
                                    <li>
                                        <a href="/orders" className="block px-4 py-2 hover:bg-gray-700 rounded">
                                            Órdenes
                                        </a>
                                    </li>
                                )}
                                <li>
                                    <a href="/profile" className="block px-4 py-2 hover:bg-gray-700 rounded">
                                        Perfil
                                    </a>
                                </li>
                                <li>
                                    <a href="/settings" className="block px-4 py-2 hover:bg-gray-700 rounded">
                                        Configuraciones
                                    </a>
                                </li>

                                <li>
                                    <button onClick={handleLogout} className="w-full px-4 py-2 text-start bg-red-600 hover:bg-red-700 rounded flex items-center">
                                        <RiLogoutBoxLine /> Cerrar Sesión
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </aside>
                )}
                <section className={`flex-1 p-8 bg-gray-900 text-white transition-all duration-300 ${isSidebarVisible ? 'ml-64' : 'ml-0'}`}>
                    {children}
                </section>
            </div>
        </div>
    );
};

export default Layout;
