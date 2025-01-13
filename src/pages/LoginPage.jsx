import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RiArrowLeftLine } from '@remixicon/react';

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
        <section className='bg-gray-900 min-h-screen flex items-center justify-center'>
        <div className="bg-gray-800 p-4 w-full md:w-1/3 text-white">
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-4">
                     <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300 mb-4">
                    Login
                </button>
                    <button type="submit" className="w-full bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center justify-center flex-row transition duration-300">
                    <RiArrowLeftLine className='mr-2' size={24} /> Regresar
                </button>
            </form>
            </div>
        </section>
    );
}

export default LoginPage;
