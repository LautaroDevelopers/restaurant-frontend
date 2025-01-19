import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('Pendiente');
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

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
            const order = orders.find(order => order.id === orderId);
            await axios.put(`http://192.168.0.112:5000/api/orders/${orderId}`, {
                status,
                dishes: order.dishes,
                total: order.total
            });
            setOrders(
                orders.map((order) =>
                    order.id === orderId ? { ...order, status } : order
                )
            );
        } catch (error) {
            console.error('Error al actualizar el estado:', error);
        }
    };

    const updateDishStatus = async (orderId, dishIndex, status) => {
        const order = orders.find(order => order.id === orderId);
        const updatedDishes = order.dishes.map((dish, index) => index === dishIndex ? { ...dish, status } : dish);
        const generalStatus = getGeneralStatus(updatedDishes);
        try {
            await axios.put(`http://192.168.0.112:5000/api/orders/${orderId}`, {
                status: generalStatus,
                dishes: updatedDishes,
                total: order.total
            });
            setOrders(orders.map(order => order.id === orderId ? { ...order, status: generalStatus, dishes: updatedDishes } : order));
        } catch (error) {
            console.error('Error al actualizar el estado del plato:', error);
        }
    };

    const getGeneralStatus = (dishes) => {
        const statusOrder = ['Pendiente', 'En Progreso', 'Completado'];
        const dishStatuses = dishes.map(dish => dish.status || 'Pendiente');
        const minStatus = Math.min(...dishStatuses.map(status => statusOrder.indexOf(status)));
        return statusOrder[minStatus];
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

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
            const statusOrder = { 'Pendiente': 1, 'En Progreso': 2, 'Completado': 3 };
            return statusOrder[a.status] - statusOrder[b.status];
        });

    const getDishSummary = (dishes) => {
        const summary = {};
        dishes.forEach(dish => {
            if (summary[dish.name]) {
                summary[dish.name].quantity += dish.quantity;
            } else {
                summary[dish.name] = { quantity: dish.quantity, status: dish.status };
            }
        });
        return summary;
    };

    return (
        <div className="container mx-auto p-4 max-w-full text-white">
            <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
                <div className="flex justify-between w-full">
                    <h2 className="text-3xl font-bold mb-4 md:mb-0">Gestión de Órdenes</h2>
                    <div className="flex space-x-2 md:space-x-4">
                        <div className="md:hidden">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="px-4 py-2 rounded bg-gray-800 text-white"
                            >
                                <option value="Pendiente">Pendiente</option>
                                <option value="En Progreso">En Progreso</option>
                                <option value="Completado">Completado</option>
                                <option value="All">Todos</option>
                            </select>
                        </div>
                        <div className="hidden md:flex space-x-2 md:space-x-4">
                            <button
                                onClick={() => setFilter('Pendiente')}
                                className={`px-4 py-2 rounded ${filter === 'Pendiente' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'}`}
                            >
                                Pendiente
                            </button>
                            <button
                                onClick={() => setFilter('En Progreso')}
                                className={`px-4 py-2 rounded ${filter === 'En Progreso' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'}`}
                            >
                                En Progreso
                            </button>
                            <button
                                onClick={() => setFilter('Completado')}
                                className={`px-4 py-2 rounded ${filter === 'Completado' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'}`}
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
            {filteredOrders.map((order) => {
                const dishSummary = getDishSummary(order.dishes);
                return (
                    <div key={order.id} className="border rounded-lg p-4 md:p-6 mb-4 md:mb-6 shadow-lg flex flex-col md:flex-row items-start md:items-center bg-gray-800">
                        <div className='flex flex-col justify-start w-full md:w-auto'>
                            <h3 className="text-lg font-semibold mb-2">Mesa: {order.table_number}</h3>
                            <p className="mb-2">
                                <strong>Platos:</strong> {Object.keys(dishSummary).map(dishName => `${dishName} (x${dishSummary[dishName].quantity})`).join(', ')}
                            </p>
                            <p className="mb-2"><strong>Estado:</strong> {order.status}</p>
                        </div>
                        <div className="flex space-x-2 md:space-x-4 mt-4 md:mt-0 ml-auto">
                            <button
                                onClick={() => handleShowMore(order)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                            >
                                Ver detalles
                            </button>
                            <p className='bg-gray-700 text-white px-4 py-2 rounded'>{order.status}</p>
                        </div>
                        {order.dishes.length > 5 && (
                            <button
                                onClick={() => toggleOrderDetails(order.id)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 mt-2"
                            >
                                {expandedOrderId === order.id ? 'Ocultar platos' : 'Ver todos los platos'}
                            </button>
                        )}
                        {expandedOrderId === order.id && (
                            <ul className="mt-4">
                                {order.dishes.map((dish, index) => (
                                    <li key={index} className="flex justify-between items-center mb-2">
                                        <span>{dish.name} (x{dish.quantity})</span>
                                        <select
                                            value={dish.status || 'Pendiente'}
                                            onChange={(e) => updateDishStatus(order.id, index, e.target.value)}
                                            className="bg-gray-700 text-white px-2 py-1 rounded"
                                            disabled={order.status === 'Completado'}
                                        >
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="En Progreso">En Progreso</option>
                                            <option value="Completado">Completado</option>
                                        </select>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            })}

            {selectedOrder && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4">
                        <h3 className="text-lg font-semibold mb-2">Mesa: {selectedOrder.table_number}</h3>
                        <ul>
                            {selectedOrder.dishes.map((dish, index) => (
                                <li key={index} className="flex justify-between items-center mb-2">
                                    <span>{dish.name} (x{dish.quantity})</span>
                                    <select
                                        value={dish.status || 'Pendiente'}
                                        onChange={(e) => updateDishStatus(selectedOrder.id, index, e.target.value)}
                                        className="bg-gray-700 text-white px-2 py-1 rounded"
                                        disabled={selectedOrder.status === 'Completado'}
                                    >
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="En Progreso">En Progreso</option>
                                        <option value="Completado">Completado</option>
                                    </select>
                                </li>
                            ))}
                        </ul>
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
