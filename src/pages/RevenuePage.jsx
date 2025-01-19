import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ClipLoader } from 'react-spinners';
import baseURL from '../api';

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

function RevenuePage() {
    const [revenueData, setRevenueData] = useState([]);
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
    const [endDate, setEndDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRevenueData();
    }, [startDate, endDate]);

    const fetchRevenueData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/api/revenue`);
            const revenue = response.data
                .filter(data => new Date(data.date) >= startDate && new Date(data.date) <= endDate)
                .map(data => ({
                    date: new Date(data.date).toLocaleDateString('en-GB'),
                    total: data.total,
                }));
            setRevenueData(revenue);
        } catch (error) {
            console.error('Error al obtener datos de ingresos:', error);
        } finally {
            setLoading(false);
        }
    };

    const revenueChartData = {
        labels: revenueData.map(data => data.date),
        datasets: [
            {
                label: 'Ingresos',
                data: revenueData.map(data => data.total),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: 'white',
                },
            },
            title: {
                display: true,
                text: 'Ingresos de los Últimos 30 Días',
                color: 'white',
                font: {
                    size: 20,
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: 'white',
                },
                grid: {
                    display: false,
                },
            },
            y: {
                ticks: {
                    color: 'white',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)',
                },
            },
        },
    };

    return (
        <div className="container mx-auto py-6 text-white">
            <div className="flex justify-between items-center mb-4">
                <div className="mr-4">
                    <label className="block mb-2">Fecha de inicio:</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="dd/MM/yyyy"
                        className="text-black p-2 rounded-md"
                        wrapperClassName="w-full"
                    />
                </div>
                <div>
                    <label className="block mb-2">Fecha de fin:</label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="dd/MM/yyyy"
                        className="text-black p-2 rounded-md"
                        wrapperClassName="w-full"
                    />
                </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <ClipLoader color="#ffffff" loading={loading} size={50} />
                    </div>
                ) : (
                    <Line data={revenueChartData} options={options} />
                )}
            </div>
        </div>
    );
}

export default RevenuePage;
