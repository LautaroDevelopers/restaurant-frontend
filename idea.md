```
└── 📁restaurant-frontend
    └── 📁public
        └── AboutUs.jpg
        └── Background.jpg
        └── 📁galery
            └── 1.jpg
            └── 2.jpg
            └── 3.jpg
            └── 4.jpg
            └── 5.jpg
            └── 6.jpg
        └── OurDishes.jpg
        └── vite.svg
    └── 📁src
        └── 📁components
            └── Footer.jsx
            export default function Footer() {
    return (
        <footer className="bg-[#382512] text-white py-4">
            <div className="container mx-auto text-center">
                <p>&copy; 2025 - {new Date().getFullYear()} <a href="https://televisionalternativa.com.ar">Televisión Alternativa</a> Todos los derechos reservados.</p>
                <div className="flex justify-center space-x-4 mt-2">
                    <a href="/privacy-policy" className="hover:underline">Política de privacidad</a>
                    <a href="/terms-of-service" className="hover:underline">Términos de servicio</a>
                </div>
            </div>
        </footer>
    );
}

            └── Layout.jsx
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

            └── NavBar.jsx
            export default function NavBar() {
    return (
        <nav className="fixed z-30 flex justify-center items-center w-full m-2">
            <div className="bg-[#382512cc] text-white p-5 rounded-full text-center">
                <a href="/" className="text-lg font-bold hover:underline">Inicio</a>
                <a href="/#about" className="text-lg font-bold hover:underline ml-4">Nosotros</a>
                <a href="/carta" className="text-lg font-bold hover:underline ml-4">Carta</a>
                <a href="https://maps.app.goo.gl/wPrZH3xYfvGNooM57" className="text-lg font-bold hover:underline ml-4">Ubicación</a>
            </div>
        </nav>
    );
}

            └── ProtectedRoute.jsx
            import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;

        └── index.css
        └── App.jsx
        import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import LandingPage from "./pages/LandingPage";
import MenuPage from "./pages/MenuPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

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
                <Route path="/unauthorized" element={<div>No tienes permiso para acceder a esta página</div>} />
            </Routes>
        </Router>
    );
}

export default App;

        └── main.jsx
        import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

        └── 📁pages
            └── DashboardPage.jsx
            function DashboardPage() {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">Welcome to the Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Card 1</h3>
                    <p className="text-gray-700">Content for card 1</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Card 2</h3>
                    <p className="text-gray-700">Content for card 2</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Card 3</h3>
                    <p className="text-gray-700">Content for card 3</p>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;

            └── LandingPage.jsx
            import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

function Content() {
    return (
        <>
            <div id="about" className="flex flex-col md:flex-row justify-center items-center p-8 space-y-4 md:space-y-0 md:space-x-4">
                <img src="/AboutUs.jpg" className="w-full md:w-1/4 h-auto rounded-lg shadow-lg" />
                <div className="text-lg space-y-4 text-gray-800 w-full md:w-1/2">
                    <h3 className="text-3xl text-center font-bold text-white">Sobre nosotros</h3>
                    <p>
                        Somos un restaurante especializado en comida italiana y mediterránea, con más de 10 años de experiencia. Nuestro objetivo es ofrecer a nuestros clientes
                        una experiencia gastronómica única, con platos de alta calidad y un servicio excepcional.
                    </p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row flex-wrap justify-center items-center p-8 space-y-4 md:space-y-0 md:space-x-4">
                <div className="text-lg text-gray-800 w-full md:w-1/2">
                    <h3 className="text-3xl text-center font-bold text-white">Nuestros platos</h3>
                    <p className="my-4">
                        En nuestro menú encontrarás una amplia variedad de platos italianos y mediterráneos, elaborados con ingredientes frescos y de alta calidad. Desde
                        pastas y pizzas, hasta carnes y pescados, tenemos opciones para todos los gustos.
                    </p>
                    <a href="/carta" className="px-4 py-2 bg-[#382512] text-white">Ver carta</a>
                </div>
                <img src="/OurDishes.jpg" className="w-full md:w-1/4 h-auto rounded-lg shadow-lg" />
            </div>
        </>
    );
}

function Galery() {
    const images = [
        "/galery/1.jpg",
        "/galery/2.jpg",
        "/galery/3.jpg",
        "/galery/4.jpg",
        "/galery/5.jpg",
        "/galery/6.jpg"
    ];
    return (
        <div className="p-8">
            <h3 className="text-3xl text-center font-bold text-white">Galería</h3>
            <p className="text-gray-800 text-center mb-4">Explora nuestra galería de imágenes para conocer más sobre nuestro restaurante y nuestros platos.</p>
            <div className="flex flex-col md:flex-row flex-wrap justify-center items-center space-y-4 md:space-y-2 md:space-x-4">
                {images.map((image, index) => (
                    <img key={index} src={image} className="w-full md:w-1/4 h-auto rounded-lg shadow-lg" />
                ))}
            </div>
        </div>
    );
}

export default function LandingPage() {
    return (
        <div className="bg-[#a37d51]">
            <NavBar />
            <div className="flex flex-col items-center space-y-4 justify-center min-h-screen coffee-bg">
                <h1 className="text-4xl font-bold text-white text-center">Bienvenido a nuestro restaurante</h1>
                <p className="mt-4 text-lg text-gray-100">Descubre nuestros platos y servicios</p>
                <a href="/carta" className="bg-orange-500 text-lg px-4 py-2 font-medium hover:bg-orange-400">Carta</a>
            </div>
            <Content />
            <Galery />
            <Footer />
        </div>
    );
}

            └── LoginPage.jsx
            import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://192.168.0.112:5000/api/users/login', { username, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error logging in:', error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
}

export default LoginPage;

            └── MenuPage.jsx
            import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from "../components/NavBar";
import { RiSearchLine } from "@remixicon/react";
import Footer from "../components/Footer";

function Search({ searchTerm, setSearchTerm }) {
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="w-full p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-center">
                <RiSearchLine className="text-gray-200 mr-2" />
                <input
                    type="text"
                    placeholder="Buscar platillo bebida"
                    className="w-full p-2 border border-gray-300 rounded-2xl"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
        </div>
    );
}

function Cards({ searchTerm, menu }) {
    const filteredMenu = menu.filter(dish =>
        dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {filteredMenu.map((dish) => (
                    <div key={dish.name} className="bg-white p-4 rounded-lg shadow-lg">
                        <img src={dish.image_url} className="w-full h-auto rounded-lg" alt={dish.name} />
                        <h4 className="text-xl font-bold text-gray-800 my-2">{dish.name}</h4>
                        <p className="text-xl font-bold text-gray-800 my-2">{dish.description}</p>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-xl font-bold text-gray-800">${dish.price} USD</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function MenuPage() {
    const [menu, setMenu] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios.get('http://192.168.0.112:5000/api/menu')
            .then(response => {
                setMenu(response.data);
            })
            .catch(error => {
                console.error('Error al obtener la carta:', error);
            });
    }, []);

    return (
        <div className="coffee-bg min-h-screen">
            <NavBar />
            <div className="flex flex-col justify-center items-center pt-20">
                <h1 className="text-4xl font-bold text-white text-center">Nuestra Carta</h1>
                <p className="text-lg text-gray-100 text-center mb-2">
                    Descubre nuestra selección de platillos y bebidas
                </p>
                <a href="" className="bg-orange-500 text-lg px-4 py-2 font-medium hover:bg-orange-400">Llamar Mesero</a>
            </div>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <div className="p-8">
                <Cards searchTerm={searchTerm} menu={menu} />
            </div>
            <Footer />
        </div>
    );
}

            └── ProfilePage.jsx
            // src/pages/ProfilePage.jsx
import React from 'react';

const ProfilePage = () => {


    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">Profile</h2>
            <p className="text-gray-700">This is the profile page content.</p>

        </div>
    );
};

export default ProfilePage;

            └── SettingsPage.jsx
            // src/pages/SettingsPage.jsx
import React from 'react';

const SettingsPage = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">Settings</h2>
            <p className="text-gray-700">This is the settings page content.</p>
        </div>
    );
};

export default SettingsPage;

            └── UsersPage.jsx
            import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { RiMore2Fill } from '@remixicon/react';

function UsersPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);

    const roles = ['Cocina', 'Mozo', 'Administrador'];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://192.168.0.112:5000/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://192.168.0.112:5000/api/users/register', { username, password, role });
            fetchUsers();
            setShowModal(false);
        } catch (error) {
            console.error('Error registering:', error.response?.data?.message || error.message);
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setDropdownOpen(null);
    };

    const handleUpdateUser = async (userId, updatedUser) => {
        try {
            await axios.put(`http://192.168.0.112:5000/api/users/${userId}`, updatedUser);
            fetchUsers();
            setEditingUser(null);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://192.168.0.112:5000/api/users/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const toggleDropdown = (userId) => {
        setDropdownOpen(dropdownOpen === userId ? null : userId);
    };

    return (
        <div className="container mx-auto relative">
            <h2 className="text-2xl font-bold mb-4">Usuarios</h2>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                onClick={() => setShowModal(true)}
            >
                Agregar Usuario
            </button>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th>Username</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-100">
                                <td className="px-4 py-2 border-b text-center">
                                    {editingUser?.id === user.id ? (
                                        <input
                                            type="text"
                                            value={editingUser.username}
                                            onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    ) : (
                                        <span onDoubleClick={() => handleEditUser(user)}>{user.username}</span>
                                    )}
                                </td>
                                <td className="px-4 py-2 border-b text-center">
                                    {editingUser?.id === user.id ? (
                                        <select
                                            value={editingUser.role}
                                            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        >
                                            {roles.map((role) => (
                                                <option key={role} value={role}>
                                                    {role}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span onDoubleClick={() => handleEditUser(user)}>{user.role}</span>
                                    )}
                                </td>
                                <td className="px-4 py-2 border-b text-center relative">
                                    {editingUser?.id === user.id ? (
                                        <>
                                            <button
                                                className="bg-green-500 text-white px-4 py-2 rounded"
                                                onClick={() => handleUpdateUser(user.id, editingUser)}
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                                                onClick={handleCancelEdit}
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex justify-center items-center">
                                            <div className="hidden md:flex space-x-2">
                                                <button
                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                                    onClick={() => handleEditUser(user)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                            <div className="relative md:hidden">
                                                <button
                                                    className="bg-gray-500 text-white px-3 py-1 rounded ml-2"
                                                    onClick={() => toggleDropdown(user.id)}
                                                >
                                                    <RiMore2Fill />
                                                </button>
                                                {dropdownOpen === user.id && (
                                                    <div className="fixed right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-md z-50">
                                                        <button
                                                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                                            onClick={() => {
                                                                handleEditUser(user);
                                                            }}
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                                            onClick={() => {
                                                                handleDeleteUser(user.id);
                                                                setDropdownOpen(null);
                                                            }}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-sm mx-4">
                        <h2 className="text-2xl font-bold mb-4">Registrar Usuario</h2>
                        <form onSubmit={handleRegister}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="">Seleccione un rol</option>
                                    {roles.map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                Registrar
                            </button>
                            <button
                                type="button"
                                className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UsersPage;

    └── .gitignore
    └── eslint.config.js
    └── frontend.zip
    └── idea.md
    └── index.html
    └── package-lock.json
    └── package.json
    └── postcss.config.js
    └── README.md
    └── tailwind.config.js
    └── vite.config.js
```

```
└── 📁restaurant-backend
    └── 📁controllers
    └── 📁middleware
    └── 📁models
        └── userModel.js
        const db = require('../db');

const createUser = (username, password, role) => {
  return db.promise().query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, role]);
};

module.exports = { createUser };

    └── 📁routes
        └── menuRoutes.js
        const express = require('express');
const db = require('../db');

const router = express.Router();

// Ruta para obtener todos los platos del menú
router.get('/', (req,res) => {
    const query = 'SELECT * FROM dishes';  // Consulta para obtener los platos del menú
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener la carta' });
        }
        res.json(results);  // Enviamos los platos del menú como respuesta
    });
});

module.exports = router;

        └── userRoutes.js
        const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');  // Importar la conexión a la base de datos

const router = express.Router();

// Registro de usuario
router.post('/register', (req, res) => {
  const { username, password, role } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Error al cifrar la contraseña' });
    }

    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.query(query, [username, hashedPassword, role], (err) => {
      if (err) {
        console.error('Error al registrar usuario:', err);
        return res.status(500).json({ message: 'Error al registrar usuario' });
      }
      res.status(201).json({ message: 'Usuario registrado exitosamente' });
    });
  });
});

// Login de usuario
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error en la base de datos:', err);
      return res.status(500).json({ message: 'Error en la base de datos' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error al verificar la contraseña:', err);
        return res.status(500).json({ message: 'Error al verificar la contraseña' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'defaultSecret',  // Usa una clave secreta segura en producción
        { expiresIn: '1h' }
      );
      res.json({ message: 'Login exitoso', token, role: user.role });
    });
  });
});

// Ruta para obtener todos los usuarios
router.get('/', (req, res) => {
  const query = 'SELECT id, username, role FROM users';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener usuarios:', err);
      return res.status(500).json({ message: 'Error al obtener usuarios' });
    }
    res.json(results);
  });
});

// Ruta para crear un nuevo usuario
router.post('/', (req, res) => {
  const { username, password, role } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Error al cifrar la contraseña' });
    }

    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.query(query, [username, hashedPassword, role], (err) => {
      if (err) {
        console.error('Error al crear usuario:', err);
        return res.status(500).json({ message: 'Error al crear usuario' });
      }
      res.status(201).json({ message: 'Usuario creado exitosamente' });
    });
  });
});

// Ruta para eliminar un usuario
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error('Error al eliminar usuario:', err);
      return res.status(500).json({ message: 'Error al eliminar usuario' });
    }
    res.json({ message: 'Usuario eliminado exitosamente' });
  });
});

// Ruta para actualizar el rol de un usuario
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const query = 'UPDATE users SET role = ? WHERE id = ?';
  db.query(query, [role, id], (err) => {
    if (err) {
      console.error('Error al actualizar rol:', err);
      return res.status(500).json({ message: 'Error al actualizar rol' });
    }
    res.json({ message: 'Rol actualizado exitosamente' });
  });
});

// Ruta para actualizar completamente un usuario
router.put('/edit/:id', (req, res) => {
  const { id } = req.params;
  const { username, first_name, last_name, email, password, role } = req.body;

  // Si se envía una nueva contraseña, la ciframos
  if (password) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: 'Error al cifrar la contraseña' });
      }
      const query = `
        UPDATE users
        SET username = ?, first_name = ?, last_name = ?, email = ?, password = ?, role = ?
        WHERE id = ?`;
      db.query(query, [username, first_name, last_name, email, hashedPassword, role, id], (err) => {
        if (err) {
          console.error('Error al actualizar usuario:', err);
          return res.status(500).json({ message: 'Error al actualizar usuario' });
        }
        res.json({ message: 'Usuario actualizado exitosamente' });
      });
    });
  } else {
    const query = `
      UPDATE users
      SET username = ?, first_name = ?, last_name = ?, email = ?, role = ?
      WHERE id = ?`;
    db.query(query, [username, first_name, last_name, email, role, id], (err) => {
      if (err) {
        console.error('Error al actualizar usuario:', err);
        return res.status(500).json({ message: 'Error al actualizar usuario' });
      }
      res.json({ message: 'Usuario actualizado exitosamente' });
    });
  }
});

module.exports = router;

    └── .env
    └── db.js
    const mysql = require('mysql2');
require('dotenv').config();

// Conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

module.exports = db;

    └── package-lock.json
    └── package.json
    └── server.js
    const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const menuRoutes = require('./routes/menuRoutes');

const app = express();

// Configurar CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());

// Usar las rutas
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

```
