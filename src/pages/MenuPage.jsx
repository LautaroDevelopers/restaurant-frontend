import { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from "../components/NavBar";
import { RiSearchLine } from '@remixicon/react';
import Footer from "../components/Footer";
import PropTypes from 'prop-types';
import baseURL from '../api';

Cards.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    menu: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        image_url: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
    })).isRequired,
    onProductClick: PropTypes.func.isRequired,
};

Search.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    setSearchTerm: PropTypes.func.isRequired,
};

function Search({ searchTerm, setSearchTerm }) {
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="w-full p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-center">
                <RiSearchLine className="text-gray-200 mr-2" />
                <input
                    type="text"
                    placeholder="Buscar platillo bebida"
                    className="w-full p-2 border border-gray-300 rounded-2xl"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
        </div>
    );
}

function Cards({ searchTerm, menu, onProductClick }) {
    const filteredMenu = menu.filter(dish =>
        dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {filteredMenu.map((dish) => (
                    <div key={dish.name} className="bg-white p-4 rounded-lg shadow-lg cursor-pointer" onClick={() => onProductClick(dish)}>
                        <img src={`${baseURL}${dish.image_url}`} className="w-full h-auto rounded-lg" alt={dish.name} />
                        <h4 className="text-xl font-bold text-gray-800 my-2">{dish.name}</h4>
                        <p className="text-gray-600 my-2">
                            {dish.description.length > 100 ? `${dish.description.substring(0, 100)}...` : dish.description}
                        </p>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-xl font-bold text-gray-800">${dish.price} ARS</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function MenuPage() {
    const [menu, setMenu] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        axios.get(`${baseURL}/api/menu`)
            .then(response => {
                setMenu(response.data);
            })
            .catch(error => {
                console.error('Error al obtener la carta:', error);
            });
    }, []);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    return (
        <div className="coffee-bg min-h-screen">
            <NavBar />
            <div className="flex flex-col justify-center items-center pt-20">
                <h1 className="text-4xl font-bold text-white text-center">Nuestra Carta</h1>
                <p className="text-lg text-gray-100 text-center mb-2">
                    Descubre nuestra selección de platillos y bebidas
                </p>
                <a href="#" className="bg-orange-500 text-lg px-4 py-2 font-medium hover:bg-orange-400">Llamar Mesero</a>
            </div>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <div className="p-8">
                <Cards searchTerm={searchTerm} menu={menu} onProductClick={handleProductClick} />
            </div>
            <Footer />

            {showModal && selectedProduct && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                            <button
                                className="text-gray-500 hover:text-gray-700 transition duration-300"
                                onClick={() => setShowModal(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <img src={`${baseURL}${selectedProduct.image_url}`} className="w-full h-48 object-cover rounded-lg mb-4" alt={selectedProduct.name} />
                        <p className="text-lg text-gray-700 mb-4">{selectedProduct.description}</p>
                        <p className="text-lg text-gray-700 mb-4">Precio: ${selectedProduct.price} ARS</p>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
                            onClick={() => setShowModal(false)}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
