import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from "../components/NavBar";
import { RiSearchLine } from "@remixicon/react";
import Footer from "../components/Footer";

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

function Cards({ searchTerm, menu }) {
    const filteredMenu = menu.filter(dish =>
        dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {filteredMenu.map((dish) => (
                    <div key={dish.name} className="bg-white p-4 rounded-lg shadow-lg">
                        <img src={dish.image_url} className="w-full h-auto rounded-lg" alt={dish.name} />
                        <h4 className="text-xl font-bold text-gray-800 my-2">{dish.name}</h4>
                        <p className="text-xl font-bold text-gray-800 my-2">{dish.description}</p>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-xl font-bold text-gray-800">${dish.price} USD</span>
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

    useEffect(() => {
        axios.get('http://192.168.0.112:5000/api/menu')
            .then(response => {
                setMenu(response.data);
            })
            .catch(error => {
                console.error('Error al obtener la carta:', error);
            });
    }, []);

    return (
        <div className="coffee-bg min-h-screen">
            <NavBar />
            <div className="flex flex-col justify-center items-center pt-20">
                <h1 className="text-4xl font-bold text-white text-center">Nuestra Carta</h1>
                <p className="text-lg text-gray-100 text-center mb-2">
                    Descubre nuestra selección de platillos y bebidas
                </p>
                <a href="" className="bg-orange-500 text-lg px-4 py-2 font-medium hover:bg-orange-400">Llamar Mesero</a>
            </div>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <div className="p-8">
                <Cards searchTerm={searchTerm} menu={menu} />
            </div>
            <Footer />
        </div>
    );
}
