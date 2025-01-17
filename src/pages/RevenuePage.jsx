import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

function RevenuePage() {
    const [revenueData, setRevenueData] = useState([]);

    useEffect(() => {
        fetchRevenueData();
    }, []);

    const fetchRevenueData = async () => {
        try {
            const response = await axios.get('http://192.168.0.112:5000/api/revenue');
            const revenue = response.data.map(data => ({
                date: new Date(data.date).toLocaleDateString('en-GB'),
                total: data.total,
            }));
            setRevenueData(revenue);
        } catch (error) {
            console.error('Error al obtener datos de ingresos:', error);
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

    return (
        <div className="container mx-auto px-4 py-6 text-white">
            <h2 className="text-3xl font-bold mb-4">Ingresos a lo Largo del Tiempo</h2>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <Line data={revenueChartData} />
            </div>
        </div>
    );
}

export default RevenuePage;
