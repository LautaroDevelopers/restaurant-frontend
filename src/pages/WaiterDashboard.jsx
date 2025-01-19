import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const WaiterDashboard = () => {
    const { tableNumber } = useParams();
    const [orders, setOrders] = useState([]);
    const [menuDishes, setMenuDishes] = useState([]);
    const [selectedDishes, setSelectedDishes] = useState([]);
    const [newDish, setNewDish] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [total, setTotal] = useState(0);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [tableStatus, setTableStatus] = useState('');

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

    useEffect(() => {
        const fetchTableStatus = async () => {
            try {
                const response = await axios.get(`http://192.168.0.112:5000/api/tables/${tableNumber}`);
                setTableStatus(response.data.status);
                if (response.data.status === 'Abierta') {
                    setSelectedDishes([]);
                    setTotal(0);
                }
            } catch (error) {
                console.error('Error al obtener el estado de la mesa:', error);
            }
        };
        fetchTableStatus();
    }, [tableNumber]);

    const createOrUpdateOrder = async () => {
        if (tableStatus !== 'Ocupada') {
            setError('La mesa no está ocupada. No se puede crear o actualizar el pedido.');
            return;
        }

        setLoading(true);
        try {
            const existingOrder = orders.find(order => order.table_number === parseInt(tableNumber));
            if (existingOrder) {
                const updatedDishes = [...existingOrder.dishes];
                selectedDishes.forEach(newDish => {
                    const existingDish = updatedDishes.find(dish => dish.id === newDish.id);
                    if (existingDish) {
                        existingDish.quantity += newDish.quantity;
                        existingDish.status = 'Pendiente';
                    } else {
                        updatedDishes.push({ ...newDish, status: 'Pendiente' });
                    }
                });
                const updatedTotal = updatedDishes.reduce((acc, dish) => acc + dish.quantity * parseFloat(dish.price), 0);
                await axios.put(`http://192.168.0.112:5000/api/orders/${existingOrder.id}`, {
                    status: 'Pendiente',
                    dishes: updatedDishes,
                    total: updatedTotal.toFixed(2)
                });
                setOrders(orders.map(order => order.id === existingOrder.id ? { ...order, status: 'Pendiente', dishes: updatedDishes, total: updatedTotal.toFixed(2) } : order));
            } else {
                const response = await axios.post('http://192.168.0.112:5000/api/orders', {
                    table_number: tableNumber,
                    dishes: selectedDishes,
                    total: total.toFixed(2)
                });
                setOrders([...orders, response.data]);
            }
            setSelectedDishes([]);
            setTotal(0);
            setSuccess('Pedido actualizado exitosamente');
            setError(null);
        } catch (error) {
            console.error('Error al crear/actualizar el pedido:', error);
            setError('No se pudo crear/actualizar el pedido');
            setSuccess(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await axios.get('http://192.168.0.112:5000/api/menu');
                setMenuDishes(response.data);
            } catch (error) {
                console.error('Error al obtener la carta:', error);
            }
        };
        fetchMenu();
    }, []);

    const filteredDishes = menuDishes.filter(dish =>
        dish.name.toLowerCase().includes(newDish.toLowerCase())
    );

    const removeDish = (index) => {
        const dishToRemove = selectedDishes[index];
        if (dishToRemove.quantity > 1) {
            setSelectedDishes(
                selectedDishes.map((d, i) =>
                    i === index ? { ...d, quantity: d.quantity - 1 } : d
                )
            );
        } else {
            setSelectedDishes(selectedDishes.filter((_, i) => i !== index));
        }
        setTotal(total - parseFloat(dishToRemove.price));
        setSuccess('Plato eliminado exitosamente');
        setError(null);
    };

    const handleDishSelect = (dish) => {
        const existingDish = selectedDishes.find(d => d.id === dish.id);
        if (existingDish) {
            setSelectedDishes(
                selectedDishes.map(d =>
                    d.id === dish.id ? { ...d, quantity: d.quantity + 1 } : d
                )
            );
        } else {
            setSelectedDishes([...selectedDishes, { ...dish, quantity: 1, status: 'Pendiente' }]);
        }
        setTotal(total + parseFloat(dish.price));
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const currentOrder = orders.find(order => order.table_number === parseInt(tableNumber));

    return (
        <div className="container mx-auto p-4 max-w-full text-white bg-gray-900">
            <h1 className="text-3xl font-bold mb-6 text-white">Crear/Actualizar Pedido para Mesa {tableNumber}</h1>

            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}

            <div className="mb-6">
                <div className="mb-4">
                    <label className="block mb-2 text-white">Añadir Plato</label>
                    <input
                        type="text"
                        placeholder="Escribe para buscar un plato"
                        value={newDish}
                        onChange={(e) => setNewDish(e.target.value)}
                        className="block w-full border rounded p-2 bg-gray-800 text-white"
                        disabled={tableStatus !== 'Ocupada'}
                    />
                    {newDish && (
                        <ul className="bg-gray-800 border rounded mt-2">
                            {filteredDishes.map((dish, index) => (
                                <li
                                    key={index}
                                    onClick={() => {
                                        handleDishSelect(dish);
                                        setNewDish('');
                                    }}
                                    className="p-2 cursor-pointer hover:bg-gray-700"
                                >
                                    {dish.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="flex flex-col space-y-4 mb-4">
                    <button
                        onClick={createOrUpdateOrder}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 w-full"
                        disabled={loading || tableStatus !== 'Ocupada'}
                    >
                        {loading ? 'Creando/Actualizando...' : 'Crear/Actualizar Pedido'}
                    </button>
                </div>
                <ul className="mb-4">
                    {selectedDishes.map((dish, index) => (
                        <li key={index} className="flex justify-between items-center mb-2 border rounded p-3 bg-gray-800">
                            {dish.name} (x{dish.quantity})
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => removeDish(index)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4 text-white-400">Pedido Actual para Mesa {tableNumber}</h2>
                {currentOrder && (
                    <div key={currentOrder.id} className="rounded-lg px-1 mb-4 shadow-lg bg-gray-800">
                        <ul>
                            {currentOrder.dishes.slice(0, 5).map((dish, index) => (
                                <li key={index} className="flex justify-between items-center mb-2 border rounded p-2 bg-gray-700">
                                    <span>{dish.name} (x{dish.quantity})</span>
                                    <p className='bg-gray-600 text-white px-4 py-2 rounded'>{dish.status}</p>
                                </li>
                            ))}
                        </ul>
                        {currentOrder.dishes.length > 5 && (
                            <button
                                onClick={() => toggleOrderDetails(currentOrder.id)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 mt-2"
                            >
                                {expandedOrderId === currentOrder.id ? 'Ocultar platos' : 'Ver todos los platos'}
                            </button>
                        )}
                        {expandedOrderId === currentOrder.id && (
                            <ul className="mt-4">
                                {currentOrder.dishes.slice(5).map((dish, index) => (
                                    <li key={index + 5} className="flex justify-between items-center mb-2 border rounded p-2 bg-gray-700">
                                        <span>{dish.name} (x{dish.quantity})</span>
                                        <p className='bg-gray-600 text-white px-4 py-2 rounded'>{dish.status}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
                {currentOrder && (
                    <p className="text-lg font-semibold text-white">Total: ${currentOrder.total}</p>
                )}
            </div>
        </div>
    );
};

export default WaiterDashboard;
