import { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
    const [ profile, setProfile ] = useState(null);
    const [ error, setError ] = useState(null);

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
            } catch (err) {
                setError('Error fetching profile data');
                console.error(err);
            }
        };

        fetchProfile();
    }, []);

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
                <div className='flex flex-col md:flex-row mb-6 space-y-4 md:space-y-0 md:space-x-6'>
                    <div className="flex-1">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">Nombre</label>
                        <input type="text" id="firstName" name="firstName" value={profile.first_name} className="mt-2 p-3 border-b-2 border-blue-700 rounded-lg w-full bg-gray-700 text-white" />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">Apellido</label>
                        <input type="text" id="lastName" name="lastName" value={profile.last_name} className="mt-2 p-3 border-b-2 border-blue-700 rounded-lg w-full bg-gray-700 text-white" />
                    </div>
                </div>
                <div className="mb-6">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300">Nombre de Usuario</label>
                    <input type="text" id="username" name="username" value={profile.username} className="mt-2 p-3 border-b-2 border-blue-700 rounded-lg w-full bg-gray-700 text-white" />
                </div>
                <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">Correo Electrónico</label>
                    <input type="email" id="email" name="email" value={profile.email} className="mt-2 p-3 border-b-2 border-blue-700 rounded-lg w-full bg-gray-700 text-white" />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300">Rol</label>
                    <div className="mt-2 p-3 border-b-2 border-blue-700 rounded-lg w-full bg-gray-700 text-white"> {profile.role} </div>
                </div>
                <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300">Guardar Cambios</button>
            </div>
            <div className="flex-1 p-6 bg-gray-800 shadow-md rounded-lg mt-6 md:mt-0 md:ml-6">
                <h2 className="text-2xl font-semibold mb-6 text-white">Cambiar Contraseña</h2>
                <div className="mb-6">
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300">Contraseña Actual</label>
                    <input type="password" id="currentPassword" name="currentPassword" className="mt-2 p-3 border-b-2 border-blue-700 rounded-lg w-full bg-gray-700 text-white" />
                </div>
                <div className="mb-6">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">Nueva Contraseña</label>
                    <input type="password" id="newPassword" name="newPassword" className="mt-2 p-3 border-b-2 border-blue-700 rounded-lg w-full bg-gray-700 text-white" />
                </div>
                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirmar Nueva Contraseña</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" className="mt-2 p-3 border-b-2 border-blue-700 rounded-lg w-full bg-gray-700 text-white" />
                </div>
                <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300">Cambiar Contraseña</button>
            </div>
        </div>
    );
};

export default ProfilePage;
