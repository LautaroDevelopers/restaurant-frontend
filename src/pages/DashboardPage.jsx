import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, ArcElement, PointElement } from 'chart.js';
import baseURL from '../api';

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, ArcElement, PointElement);

function DashboardPage() {
    const [stats, setStats] = useState({ platos: 0, usuarios: 0, pedidos: 0 });
    const [revenueData, setRevenueData] = useState([]);
    const [usersData, setUsersData] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchRevenueData();
        fetchUsersData();
    }, []);

    const fetchStats = async () => {
        try {
            const [dishesResponse, usersResponse, ordersResponse] = await Promise.all([
                axios.get(`${baseURL}/api/menu`),
                axios.get(`${baseURL}/api/users`),
                axios.get(`${baseURL}/api/orders`),
            ]);

            setStats({
                platos: dishesResponse.data.length,
                usuarios: usersResponse.data.length,
                pedidos: ordersResponse.data.length,
            });
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
        }
    };

    const fetchRevenueData = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/revenue`);
            const revenue = response.data.map(data => ({
                date: new Date(data.date).toLocaleDateString('en-GB'),
                total: data.total,
            }));
            setRevenueData(revenue);
        } catch (error) {
            console.error('Error al obtener datos de ingresos:', error);
        }
    };

    const fetchUsersData = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/users`);
            setUsersData(response.data);
        } catch (error) {
            console.error('Error al obtener datos de usuarios:', error);
        }
    };

    const revenueChartData = {
        labels: revenueData.map(data => data.date),
        datasets: [
            {
                label: 'Ingresos',
                data: revenueData.map(data => data.total),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false,
                tension: 0.1,
            },
        ],
    };

    const usersChartData = {
        labels: ['Cocina', 'Mozo', 'Administrador'],
        datasets: [
            {
                label: 'Usuarios por Rol',
                data: [
                    usersData.filter(user => user.role === 'Cocina').length,
                    usersData.filter(user => user.role === 'Mozo').length,
                    usersData.filter(user => user.role === 'Administrador').length,
                ],
                backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container mx-auto px-4 py-6 text-white">
            <h2 className="text-3xl font-bold mb-4">Bienvenido al Panel de Control</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Total de Platos</h3>
                    <p className="text-gray-300">{stats.platos}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Total de Usuarios</h3>
                    <p className="text-gray-300">{stats.usuarios}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Total de Pedidos</h3>
                    <p className="text-gray-300">{stats.pedidos}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Ingresos a lo Largo del Tiempo</h3>
                    <Line data={revenueChartData} />
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Usuarios por Rol</h3>
                    <Pie data={usersChartData} />
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
