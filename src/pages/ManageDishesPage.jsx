import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiMore2Fill } from '@remixicon/react';
import baseURL from '../api';

const ManageDishesPage = () => {
    const [dishes, setDishes] = useState([]);
    const [newDish, setNewDish] = useState({ name: '', description: '', price: '', image: null });
    const [editingDish, setEditingDish] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState('');

    useEffect(() => {
        fetchDishes();
    }, []);

    const fetchDishes = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/menu`);
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

    const handleAddDish = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newDish.name);
        formData.append('description', newDish.description);
        formData.append('price', newDish.price);
        if (newDish.image) {
            formData.append('image', newDish.image);
        }

        try {
            await axios.post(`${baseURL}/api/menu`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchDishes();
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Error adding dish:', error);
        }
    };

    const handleEditDish = (dish) => {
        setEditingDish(dish);
        setShowModal(true);
    };

    const handleUpdateDish = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', editingDish.name);
        formData.append('description', editingDish.description);
        formData.append('price', editingDish.price);
        if (selectedFileName) {
            formData.append('image', newDish.image);
        }

        try {
            await axios.put(`${baseURL}/api/menu/${editingDish.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchDishes();
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Error updating dish:', error);
        }
    };

    const handleDeleteDish = async (id) => {
        try {
            await axios.delete(`${baseURL}/api/menu/${id}`);
            fetchDishes();
        } catch (error) {
            console.error('Error deleting dish:', error);
        }
    };

    const toggleDropdown = (dishId) => {
        setDropdownOpen(dropdownOpen === dishId ? null : dishId);
    };

    const resetForm = () => {
        setNewDish({ name: '', description: '', price: '', image: null });
        setSelectedFileName('');
        setEditingDish(null);
    };

    return (
        <div className="container mx-auto relative text-white px-4 py-6">
            <div className="flex flex-row justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Platos</h2>
                <button
                    className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300"
                    onClick={() => setShowModal(true)}
                >
                    Agregar Plato
                </button>
            </div>

            <div className="overflow-x-auto w-full">
                <div className="w-full md:hidden">
                    {dishes.map((dish) => (
                        <div key={dish.id} className="bg-gray-800 rounded-lg p-4 mb-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    {dish.image_url && (
                                        <img
                                            src={`${baseURL}${dish.image_url}`}
                                            alt={dish.name}
                                            className="w-16 h-16 object-cover rounded-full"
                                        />
                                    )}
                                    <div>
                                        <h3 className="text-xl">{dish.name}</h3>
                                        <p className="text-gray-400">{dish.description}</p>
                                    </div>
                                </div>
                                <button
                                    className="bg-gray-700 text-white px-3 py-1 rounded"
                                    onClick={() => toggleDropdown(dish.id)}
                                >
                                    <RiMore2Fill />
                                </button>
                            </div>

                            {dropdownOpen === dish.id && (
                                <div className="mt-2 bg-gray-800 border border-gray-700 rounded shadow-md">
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-gray-700"
                                        onClick={() => handleEditDish(dish)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-gray-700"
                                        onClick={() => handleDeleteDish(dish.id)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="hidden md:block">
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
                                        {dish.image_url && (
                                            <img
                                                src={`${baseURL}${dish.image_url}`}
                                                alt={dish.name}
                                                className="w-16 h-16 object-cover mx-auto"
                                            />
                                        )}
                                    </td>
                                    <td className="px-4 py-2 border-b border-gray-700 text-center">{dish.name}</td>
                                    <td className="px-4 py-2 border-b border-gray-700 text-center">
                                        {dish.description.length > 50
                                            ? `${dish.description.substring(0, 50)}...`
                                            : dish.description}
                                    </td>
                                    <td className="px-4 py-2 border-b border-gray-700 text-center">${dish.price}</td>
                                    <td className="px-4 py-2 border-b border-gray-700 text-center">
                                        <div className="flex space-x-2 justify-center">
                                            <button
                                                className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                                onClick={() => handleEditDish(dish)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                                onClick={() => handleDeleteDish(dish.id)}
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
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4">
                        <h2 className="text-2xl font-bold mb-4">
                            {editingDish ? 'Editar Plato' : 'Agregar Nuevo Plato'}
                        </h2>
                        <form onSubmit={editingDish ? handleUpdateDish : handleAddDish}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    name="name"
                                    value={editingDish?.name || newDish.name}
                                    onChange={(e) =>
                                        editingDish
                                            ? setEditingDish({ ...editingDish, name: e.target.value })
                                            : handleInputChange(e)
                                    }
                                    placeholder="Nombre"
                                    className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white"
                                />
                            </div>
                            <div className="mb-4">
                                <textarea
                                    name="description"
                                    value={editingDish?.description || newDish.description}
                                    onChange={(e) =>
                                        editingDish
                                            ? setEditingDish({ ...editingDish, description: e.target.value })
                                            : handleInputChange(e)
                                    }
                                    placeholder="Descripción"
                                    className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="number"
                                    name="price"
                                    value={editingDish?.price || newDish.price}
                                    onChange={(e) =>
                                        editingDish
                                            ? setEditingDish({ ...editingDish, price: e.target.value })
                                            : handleInputChange(e)
                                    }
                                    placeholder="Precio"
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
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    {editingDish ? 'Guardar Cambios' : 'Agregar'}
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
