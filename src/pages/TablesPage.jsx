import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import baseURL from '../api';

const TablesPage = () => {
    const [tables, setTables] = useState([]);
    const [newTableNumber, setNewTableNumber] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/tables`);
            setTables(response.data);
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };

    const handleAddTable = async () => {
        try {
            await axios.post(`${baseURL}/api/tables`, { table_number: newTableNumber });
            setNewTableNumber('');
            fetchTables();
        } catch (error) {
            console.error('Error adding table:', error);
        }
    };

    const handleDeleteTable = async (id) => {
        try {
            await axios.delete(`${baseURL}/api/tables/${id}`);
            fetchTables();
        } catch (error) {
            console.error('Error deleting table:', error);
        }
    };

    const handleOpenTable = async (id, tableNumber) => {
        try {
            await axios.put(`${baseURL}/api/tables/${id}/status`, { status: 'Abierta' });
            fetchTables();
        } catch (error) {
            console.error('Error opening table:', error);
        }
    };

    const handleOccupyTable = async (id, tableNumber) => {
        try {
            await axios.put(`${baseURL}/api/tables/${id}/status`, { status: 'Ocupada' });
            fetchTables();
            navigate(`/pedir/${tableNumber}`);
        } catch (error) {
            console.error('Error occupying table:', error);
        }
    };

    const handleCloseTable = async (id) => {
        try {
            await axios.put(`${baseURL}/api/tables/${id}/status`, { status: 'Cerrada' });
            fetchTables();
        } catch (error) {
            console.error('Error closing table:', error);
        }
    };

    const handleOrder = (tableNumber) => {
        navigate(`/pedir/${tableNumber}`);
    };

    const getTableStyle = (status) => {
        switch (status) {
            case 'Abierta':
                return 'bg-green-800';
            case 'Ocupada':
                return 'bg-yellow-800';
            case 'Cerrada':
                return 'bg-red-800';
            default:
                return 'bg-gray-800';
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 text-white">
            <h2 className="text-3xl font-bold mb-4">Mesas</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={newTableNumber}
                    onChange={(e) => setNewTableNumber(e.target.value)}
                    placeholder="Número de mesa"
                    className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white"
                />
                <button
                    className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2"
                    onClick={handleAddTable}
                >
                    Agregar Mesa
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tables.map((table) => (
                    <div key={table.id} className={`${getTableStyle(table.status)} p-4 rounded-lg shadow-md flex flex-col justify-between items-center`}>
                        <span>Mesa: {table.table_number} ({table.status})</span>
                        <img src="/Mesa.jpg" className="w-full h-32 object-cover rounded-lg mb-2" />
                        <div className="flex space-x-2">
                            {table.status === 'Abierta' && (
                                <>
                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                                        onClick={() => handleOccupyTable(table.id, table.table_number)}
                                    >
                                        Ocupar
                                    </button>
                                    <button
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                                        onClick={() => handleOpenTable(table.id, table.table_number)}
                                    >
                                        Abrir
                                    </button>
                                </>
                            )}
                            {table.status === 'Ocupada' && (
                                <>
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                        onClick={() => handleOrder(table.table_number)}
                                    >
                                        Pedir
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                        onClick={() => handleCloseTable(table.id)}
                                    >
                                        Pagar
                                    </button>
                                </>
                            )}
                            {table.status === 'Cerrada' && (
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                                    onClick={() => handleOpenTable(table.id, table.table_number)}
                                >
                                    Abrir
                                </button>
                            )}
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                onClick={() => handleDeleteTable(table.id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TablesPage;
