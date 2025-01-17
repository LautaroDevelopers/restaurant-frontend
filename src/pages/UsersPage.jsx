import { useState, useEffect } from 'react';
import axios from 'axios';
import { RiMore2Fill } from '@remixicon/react';
import baseURL from '../api';

function UsersPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
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
            const response = await axios.get(`${baseURL}/api/users`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${baseURL}/api/users/register`, { username, password, first_name, last_name, email, role });
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
            await axios.put(`${baseURL}/api/users/${userId}`, updatedUser);
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
            await axios.delete(`${baseURL}/api/users/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const toggleDropdown = (userId) => {
        setDropdownOpen(dropdownOpen === userId ? null : userId);
    };

    return (
        <div className="container mx-auto relative text-white">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Usuarios</h2>
                <button
                    className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300"
                    onClick={() => setShowModal(true)}
                >
                    Agregar Usuario
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-700">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="px-4 py-2 border-b border-gray-700">Username</th>
                            <th className="px-4 py-2 border-b border-gray-700">Rol</th>
                            <th className="px-4 py-2 border-b border-gray-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-700">
                                <td className="px-4 py-2 border-b border-gray-700 text-center">
                                    {editingUser?.id === user.id ? (
                                        <input
                                            type="text"
                                            value={editingUser.username}
                                            onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                                            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
                                        />
                                    ) : (
                                        <span onDoubleClick={() => handleEditUser(user)}>{user.username}</span>
                                    )}
                                </td>
                                <td className="px-4 py-2 border-b border-gray-700 text-center">
                                    {editingUser?.id === user.id ? (
                                        <select
                                            value={editingUser.role}
                                            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
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
                                <td className="px-4 py-2 border-b border-gray-700 text-center relative">
                                    {editingUser?.id === user.id ? (
                                        <>
                                            <button
                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300"
                                                onClick={() => handleUpdateUser(user.id, editingUser)}
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ml-2 transition duration-300"
                                                onClick={handleCancelEdit}
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex justify-center items-center">
                                            <div className="hidden md:flex space-x-2">
                                                <button
                                                    className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded transition duration-300"
                                                    onClick={() => handleEditUser(user)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-300"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                            <div className="relative md:hidden">
                                                <button
                                                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded ml-2 transition duration-300"
                                                    onClick={() => toggleDropdown(user.id)}
                                                >
                                                    <RiMore2Fill />
                                                </button>
                                                {dropdownOpen === user.id && (
                                                    <div className="fixed right-0 mt-2 w-32 bg-gray-800 border border-gray-700 rounded shadow-md z-50">
                                                        <button
                                                            className="w-full text-left px-4 py-2 hover:bg-gray-700"
                                                            onClick={() => {
                                                                handleEditUser(user);
                                                            }}
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            className="w-full text-left px-4 py-2 hover:bg-gray-700"
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
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4">
                        <h2 className="text-2xl font-bold mb-4">Registrar Usuario</h2>
                        <form onSubmit={handleRegister}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={first_name}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Nombre"
                                    className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={last_name}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Apellido"
                                    className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Correo electronico"
                                    className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Nombre de usuario"
                                    className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Contraseña"
                                    className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white"
                                />
                            </div>
                            <div className="mb-4">
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white"
                                >
                                    <option value="">Seleccione un rol</option>
                                    {roles.map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300">
                                Registrar
                            </button>
                            <button
                                type="button"
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ml-2 transition duration-300"
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
