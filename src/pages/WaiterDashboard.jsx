import { useState, useEffect } from 'react';
import axios from 'axios';

const WaiterDashboard = () => {
    const [ orders, setOrders ] = useState([]);
    const [ tableNumber, setTableNumber ] = useState('');
    const [ menuDishes, setMenuDishes ] = useState([]);
    const [ selectedDishes, setSelectedDishes ] = useState([]);
    const [ newDish, setNewDish ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ success, setSuccess ] = useState(null);
    const [ total, setTotal ] = useState(0);

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

    const createOrder = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://192.168.0.112:5000/api/orders', {
                table_number: tableNumber,
                dishes: selectedDishes.flatMap(dish => Array(dish.quantity).fill(dish.name)),
                total: total.toFixed(2)
            });
            setOrders([ ...orders, response.data ]);
            setTableNumber('');
            setSelectedDishes([]);
            setTotal(0);
            setSuccess('Pedido creado exitosamente');
            setError(null);
        } catch (error) {
            console.error('Error al crear el pedido:', error);
            setError('No se pudo crear el pedido');
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

    return (
        <div className="container mx-auto p-4 max-w-full text-white">
            <h1 className="text-3xl font-bold mb-6">Crear Nuevo Pedido</h1>

            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}

            <div className="mb-6">
                <div className="mb-4">
                    <label className="block mb-2">Número de Mesa</label>
                    <input
                        type="text"
                        placeholder="Número de mesa"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="block w-full border rounded p-2 bg-gray-800 text-white"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Añadir Plato</label>
                    <input
                        type="text"
                        placeholder="Escribe para buscar un plato"
                        value={newDish}
                        onChange={(e) => setNewDish(e.target.value)}
                        className="block w-full border rounded p-2 bg-gray-800 text-white"
                    />
                    {newDish && (
                        <ul className="bg-gray-800 border rounded mt-2">
                            {filteredDishes.map((dish, index) => (
                                <li
                                    key={index}
                                    onClick={() => {
                                        if (!selectedDishes.includes(dish)) {
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
                        onClick={createOrder}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 w-full"
                        disabled={loading || newDish !== ''}
                    >
                        {loading ? 'Creando...' : 'Crear Pedido'}
                    </button>
                </div>
                <p className='text-xl'>Pedido</p>
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
        </div>
    );
};

export default WaiterDashboard;
