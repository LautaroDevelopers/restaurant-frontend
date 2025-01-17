import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('Pending');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://192.168.0.112:5000/api/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Error al obtener los pedidos:', error);
            }
        };
        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId, status) => {
        try {
            await axios.put(`http://192.168.0.112:5000/api/orders/${orderId}`, { status });
            setOrders(
                orders.map((order) =>
                    order.id === orderId ? { ...order, status } : order
                )
            );
        } catch (error) {
            console.error('Error al actualizar el estado:', error);
        }
    };

    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleShowMore = (order) => {
        setSelectedOrder(order);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    const handleStatusChange = (orderId, event) => {
        const newStatus = event.target.value;
        updateOrderStatus(orderId, newStatus);
    };

    const filteredOrders = orders
        .filter(order => filter === 'All' || order.status === filter)
        .sort((a, b) => {
            const statusOrder = { 'Pending': 1, 'In Progress': 2, 'Completed': 3 };
            return statusOrder[a.status] - statusOrder[b.status];
        });

    return (
        <div className="container mx-auto p-4 max-w-full text-white">
            <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
                <div className="flex justify-between w-full">
                    <h2 className="text-3xl font-bold mb-4 md:mb-0">Órdenes</h2>
                    <div className="flex space-x-2 md:space-x-4">
                        <div className="md:hidden">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="px-4 py-2 rounded bg-gray-800 text-white"
                            >
                                <option value="Pending">Pendiente</option>
                                <option value="In Progress">En Progreso</option>
                                <option value="Completed">Completado</option>
                                <option value="All">Todos</option>
                            </select>
                        </div>
                        <div className="hidden md:flex space-x-2 md:space-x-4">
                            <button
                                onClick={() => setFilter('Pending')}
                                className={`px-4 py-2 rounded ${filter === 'Pending' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'}`}
                            >
                                Pendiente
                            </button>
                            <button
                                onClick={() => setFilter('In Progress')}
                                className={`px-4 py-2 rounded ${filter === 'In Progress' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'}`}
                            >
                                En Progreso
                            </button>
                            <button
                                onClick={() => setFilter('Completed')}
                                className={`px-4 py-2 rounded ${filter === 'Completed' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'}`}
                            >
                                Completado
                            </button>
                            <button
                                onClick={() => setFilter('All')}
                                className={`px-4 py-2 rounded ${filter === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'}`}
                            >
                                Todos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {filteredOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 md:p-6 mb-4 md:mb-6 shadow-lg flex flex-col md:flex-row items-start md:items-center bg-gray-800">
                    <div className='flex flex-col justify-start w-full md:w-auto'>
                        <h3 className="text-lg font-semibold mb-2">Mesa: {order.table_number}</h3>
                        <p className="mb-2">
                            <strong>Platos:</strong> {Array.isArray(order.dishes) ? order.dishes.slice(0, 5).join(', ') : JSON.parse(order.dishes).slice(0, 5).join(', ')}
                            {Array.isArray(order.dishes) ? order.dishes.length > 5 : JSON.parse(order.dishes).length > 5 && (
                                <span className="text-blue-500 ml-2">...</span>
                            )}
                        </p>
                        <p className="mb-2"><strong>Estado:</strong> {order.status}</p>
                    </div>
                    <div className="flex space-x-2 md:space-x-4 mt-4 md:mt-0 ml-auto">
                        <button
                            onClick={() => handleShowMore(order)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                        >
                            Ver orden
                        </button>
                        <select
                            value={order.status}
                            onChange={(event) => handleStatusChange(order.id, event)}
                            className="bg-gray-700 text-white px-4 py-2 rounded"
                        >
                            <option value="Pending">Pendiente</option>
                            <option value="In Progress">En Progreso</option>
                            <option value="Completed">Completado</option>
                        </select>
                    </div>
                </div>
            ))}

            {selectedOrder && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4">
                        <h3 className="text-lg font-semibold mb-2">Mesa: {selectedOrder.table_number}</h3>
                        <p className="mb-2"><strong>Platos:</strong> {Array.isArray(selectedOrder.dishes) ? selectedOrder.dishes.join(', ') : JSON.parse(selectedOrder.dishes).join(', ')}</p>
                        <p className="mb-2"><strong>Estado:</strong> {selectedOrder.status}</p>
                        <button
                            onClick={handleCloseModal}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 mt-4"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
