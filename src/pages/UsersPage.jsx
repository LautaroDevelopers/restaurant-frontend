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
