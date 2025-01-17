import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageDishesPage = () => {
    const [dishes, setDishes] = useState([]);
    const [newDish, setNewDish] = useState({ name: '', description: '', price: '', image: null });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editDishId, setEditDishId] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState('');

    useEffect(() => {
        fetchDishes();
    }, []);

    const fetchDishes = async () => {
        try {
            const response = await axios.get('http://192.168.0.112:5000/api/menu');
            setDishes(response.data);
        } catch (error) {
            console.error('Error fetching dishes:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDish({ ...newDish, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNewDish({ ...newDish, image: file });
        setSelectedFileName(file ? file.name : '');
    };

    const handleAddDish = async () => {
        const formData = new FormData();
        formData.append('name', newDish.name);
        formData.append('description', newDish.description);
        formData.append('price', newDish.price);
        if (newDish.image) {
            formData.append('image', newDish.image);
        }

        try {
            await axios.post('http://192.168.0.112:5000/api/menu', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchDishes();
            setNewDish({ name: '', description: '', price: '', image: null });
            setSelectedFileName('');
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error adding dish:', error);
        }
    };

    const handleEditDish = async () => {
        const formData = new FormData();
        formData.append('name', newDish.name);
        formData.append('description', newDish.description);
        formData.append('price', newDish.price);
        if (newDish.image) {
            formData.append('image', newDish.image);
        }

        try {
            await axios.put(`http://192.168.0.112:5000/api/menu/${editDishId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchDishes();
            setNewDish({ name: '', description: '', price: '', image: null });
            setSelectedFileName('');
            setIsModalOpen(false);
            setIsEditMode(false);
            setEditDishId(null);
        } catch (error) {
            console.error('Error editing dish:', error);
        }
    };

    const handleDeleteDish = async (id) => {
        try {
            await axios.delete(`http://192.168.0.112:5000/api/menu/${id}`);
            fetchDishes();
        } catch (error) {
            console.error('Error deleting dish:', error);
        }
    };

    const openEditModal = (dish) => {
        setNewDish({ name: dish.name, description: dish.description, price: dish.price, image: null });
        setSelectedFileName('');
        setIsEditMode(true);
        setEditDishId(dish.id);
        setIsModalOpen(true);
    };

    return (
        <div className="container mx-auto relative text-white">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Administrar Platos</h2>
                <button
                    onClick={() => {
                        setIsEditMode(false);
                        setNewDish({ name: '', description: '', price: '', image: null });
                        setSelectedFileName('');
                        setIsModalOpen(true);
                    }}
                    className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300"
                >
                    Agregar Plato
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-700">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="px-4 py-2 border-b border-gray-700">Imagen</th>
                            <th className="px-4 py-2 border-b border-gray-700">Nombre</th>
                            <th className="px-4 py-2 border-b border-gray-700">Descripción</th>
                            <th className="px-4 py-2 border-b border-gray-700">Precio</th>
                            <th className="px-4 py-2 border-b border-gray-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dishes.map((dish) => (
                            <tr key={dish.id} className="hover:bg-gray-700">
                                <td className="px-4 py-2 border-b border-gray-700 text-center">
                                    {dish.image_url && <img src={`http://192.168.0.112:5000${dish.image_url}`} alt={dish.name} className="w-16 h-16 object-cover mx-auto" />}
                                </td>
                                <td className="px-4 py-2 border-b border-gray-700 text-center">{dish.name}</td>
                                <td className="px-4 py-2 border-b border-gray-700 text-center">{dish.description}</td>
                                <td className="px-4 py-2 border-b border-gray-700 text-center">${dish.price}</td>
                                <td className="px-4 py-2 border-b border-gray-700 text-center">
                                    <div className="flex justify-center items-center">
                                        <button
                                            onClick={() => openEditModal(dish)}
                                            className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded transition duration-300 mr-2"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDish(dish.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-300"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4">
                        <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Editar Plato' : 'Agregar Nuevo Plato'}</h2>
                        <form onSubmit={isEditMode ? handleEditDish : handleAddDish}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Nombre"
                                    value={newDish.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Descripción"
                                    value={newDish.description}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="Precio"
                                    value={newDish.price}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleFileChange}
                                    className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white"
                                />
                                {selectedFileName && <p className="text-sm mt-2">{selectedFileName}</p>}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setIsEditMode(false);
                                        setEditDishId(null);
                                        setNewDish({ name: '', description: '', price: '', image: null });
                                        setSelectedFileName('');
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300"
                                >
                                    {isEditMode ? 'Guardar Cambios' : 'Agregar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageDishesPage;
