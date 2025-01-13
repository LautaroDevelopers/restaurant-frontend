import { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
    const [ profile, setProfile ] = useState(null);
    const [ error, setError ] = useState(null);
    const [ success, setSuccess ] = useState(null);
    const [ isEditing, setIsEditing ] = useState(false);
    const [ formData, setFormData ] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://192.168.0.112:5000/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProfile(response.data);
                setFormData({
                    first_name: response.data.first_name || '',
                    last_name: response.data.last_name || '',
                    username: response.data.username || '',
                    email: response.data.email || ''
                });
            } catch (err) {
                setError('Error fetching profile data');
                console.error(err);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [ name ]: value });
    };

    const handleSaveChanges = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://192.168.0.112:5000/api/users/${profile.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProfile({ ...profile, ...formData });
            setIsEditing(false);
            setSuccess('Perfil actualizado exitosamente');
            setError(null);
        } catch (err) {
            setError('Error updating profile');
            setSuccess(null);
            console.error(err);
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col md:flex-row overflow-hidden">
            <div className="flex-1 p-6 bg-gray-800 shadow-md rounded-lg">
                <h2 className="text-2xl font-semibold mb-6 text-white">Configuración de Perfil</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {success && <div className="text-green-500 mb-4">{success}</div>}
                <div className='flex flex-col md:flex-row mb-6 space-y-4 md:space-y-0 md:space-x-6'>
                    <div className="flex-1">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">Nombre</label>
                        <input
                            type="text"
                            id="firstName"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            className="mt-2 p-3 border-b-2 border-blue-700 rounded-lg w-full bg-gray-700 text-white"
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">Apellido</label>
                        <input
                            type="text"
                            id="lastName"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            className="mt-2 p-3 border-b-2 border-blue-700 rounded-lg w-full bg-gray-700 text-white"
                            disabled={!isEditing}
                        />
                    </div>
                </div>
                <div className="mb-6">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300">Nombre de Usuario</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="mt-2 p-3 border-b-2 border-blue-700 rounded-lg w-full bg-gray-700 text-white"
                        disabled={!isEditing}
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-2 p-3 border-b-2 border-blue-700 rounded-lg w-full bg-gray-700 text-white"
                        disabled={!isEditing}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300">Rol</label>
                    <div className="mt-2 p-3 border-b-2 border-blue-700 rounded-lg w-full bg-gray-700 text-white"> {profile.role} </div>
                </div>
                {isEditing ? (
                    <button
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                        onClick={handleSaveChanges}
                    >
                        Guardar Cambios
                    </button>
                ) : (
                    <button
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                        onClick={() => setIsEditing(true)}
                    >
                        Editar Perfil
                    </button>
                )}
            </div>
            <div className="flex-1 p-6 bg-gray-800 shadow-md rounded-lg mt-6 md:mt-0 md:ml-6">
                <h2 className="text-2xl font-semibold mb-6 text-white">Cambiar Contraseña</h2>
                <ChangePasswordForm userId={profile.id} />
            </div>
        </div>
    );
};

const ChangePasswordForm = ({ userId }) => {
    const [ currentPassword, setCurrentPassword ] = useState('');
    const [ newPassword, setNewPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ error, setError ] = useState(null);
    const [ success, setSuccess ] = useState(null);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://192.168.0.112:5000/api/users/${userId}/password`, {
                currentPassword,
                newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSuccess('Contraseña actualizada exitosamente');
            setError(null);
        } catch (err) {
            setError('Error al cambiar la contraseña');
            setSuccess(null);
            console.error(err);
        }
    };

    return (
        <div>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}
            <div className="mb-6">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300">Contraseña Actual</label>
                <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-2 p-3 border-b-2 border-blue-700 rounded-lg w-full bg-gray-700 text-white"
                />
            </div>
            <div className="mb-6">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">Nueva Contraseña</label>
                <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-2 p-3 border-b-2 border-blue-700 rounded-lg w-full bg-gray-700 text-white"
                />
            </div>
            <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirmar Nueva Contraseña</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-2 p-3 border-b-2 border-blue-700 rounded-lg w-full bg-gray-700 text-white"
                />
            </div>
            <button
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                onClick={handleChangePassword}
            >
                Cambiar Contraseña
            </button>
        </div>
    );
};

export default ProfilePage;
