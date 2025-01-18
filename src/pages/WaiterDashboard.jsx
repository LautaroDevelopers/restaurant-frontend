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
            const existingOrder = orders.find(order => order.table_number === parseInt(tableNumber) && order.status !== 'Completado');
            if (existingOrder) {
                const updatedDishes = [...existingOrder.dishes];
                const newDishes = [];
                selectedDishes.forEach(newDish => {
                    const existingDish = updatedDishes.find(dish => dish.id === newDish.id);
                    if (existingDish) {
                        existingDish.quantity += newDish.quantity;
                        existingDish.addedQuantity = newDish.quantity;
                    } else {
                        updatedDishes.push({ ...newDish, addedQuantity: newDish.quantity });
                        newDishes.push(newDish);
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
            setSuccess('Pedido creado/actualizado exitosamente');
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
        const existingDish = selectedDishes.find((d) => d.id === dish.id);
        if (existingDish) {
            setSelectedDishes(
                selectedDishes.map((d) =>
                    d.id === dish.id ? { ...d, quantity: d.quantity + 1 } : d
                )
            );
        } else {
            setSelectedDishes([...selectedDishes, { ...dish, quantity: 1 }]);
        }
        setTotal(total + parseFloat(dish.price));
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

    return (
        <div className="container mx-auto p-4 max-w-full text-white bg-gray-900">
            <h1 className="text-3xl font-bold mb-6 text-center">Crear/Actualizar Pedido para Mesa {tableNumber}</h1>

            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}

            <div className="mb-6">
                <div className="mb-4">
                    <label className="block mb-2">Añadir Plato</label>
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
                                        if (!selectedDishes.some(d => d.id === dish.id)) {
                                            handleDishSelect(dish);
                                            setNewDish('');
                                        }
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
                        disabled={loading || newDish !== '' || tableStatus !== 'Ocupada'}
                    >
                        {loading ? 'Creando/Actualizando...' : 'Crear/Actualizar Pedido'}
                    </button>
                </div>
                <p className='text-xl'>Añadir al pedido</p>
                <ul className="mb-4">
                    {selectedDishes.map((dish, index) => (
                        <li key={index} className="text-gray-300 flex justify-between items-center">
                            {dish.name} (x{dish.quantity})
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => removeDish(index)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300"
                                >
                                    Eliminar
                                </button>
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                                    onClick={() => handleDishSelect(dish)}
                                >
                                    +1
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
            </div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Órdenes Existentes para Mesa {tableNumber}</h2>
                {orders.filter(order => order.table_number === parseInt(tableNumber)).map(order => (
                    <div key={order.id} className="border rounded-lg p-4 mb-4 shadow-lg bg-gray-800">
                        <h3 className="text-lg font-semibold mb-2">Pedido</h3>
                        <ul>
                            {order.dishes.map((dish, index) => (
                                <li key={index} className="flex justify-between items-center mb-2">
                                    <span>{dish.name} (x{dish.quantity}){dish.addedQuantity ? <span className="text-green-500"> +{dish.addedQuantity}</span> : ''}</span>
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
                        {order.dishes.length > 5 && (
                            <button
                                onClick={() => toggleOrderDetails(order.id)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 mt-2"
                            >
                                {expandedOrderId === order.id ? 'Ocultar platos' : 'Ver todos los platos'}
                            </button>
                        )}
                        {expandedOrderId === order.id && (
                            <ul>
                            {order.dishes.map((dish, index) => (
                                <li key={index} className="flex justify-between items-center mb-2">
                                    <span>{dish.name} (x{dish.quantity}){dish.addedQuantity ? <span className="text-green-500"> +{dish.addedQuantity}</span> : ''}</span>
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
                        {order.status !== 'Completado' && (
                            <div className="mt-4">
                                <button
                                    onClick={() => {
                                        setSelectedDishes(order.dishes.map(dish => ({ ...dish, quantity: 0 })));
                                        setTotal(0);
                                    }}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                                >
                                    Añadir más platos
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WaiterDashboard;
