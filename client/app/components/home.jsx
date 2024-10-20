"use client";
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Link from 'next/link';

let socket;

const Landing = () => {
    const [weatherData, setWeatherData] = useState([]);
    const [cityWeather, setCityWeather] = useState(null);
    const [city, setCity] = useState('');

    useEffect(() => {

        socket = io('http://localhost:8000');

        socket.on('weatherUpdate', (data) => {

            const roundedData = data.map(item => ({
                ...item,
                temp: item.temp.toFixed(1),
                feels_like: item.feels_like.toFixed(1),
                max_temp: item.max_temp.toFixed(1),
                min_temp: item.min_temp.toFixed(1),
            }));
            setWeatherData(roundedData);
        });

        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    const fetchCityWeather = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/weather/search?city=${city}`);
            const roundedCityWeather = {
                ...response.data,
                temp: response.data.temp.toFixed(1),
                feels_like: response.data.feels_like.toFixed(1),
                max_temp: response.data.max_temp.toFixed(1),
                min_temp: response.data.min_temp.toFixed(1),
            };
            setCityWeather(roundedCityWeather);
        } catch (error) {
            console.error('Error fetching city weather:', error);
        }
    };

    return (
        <>
            <div className='flex justify-center w-full mt-10'>
                <div>
                    <Link href='/summary'>
                        <h1 className='text-center bg-blue-500 p-4 rounded-lg w-[200px]'>Summary Of All Cities Weather</h1>
                    </Link>
                </div>
            </div>
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Real-Time Weather Updates</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                    {weatherData.length > 0 ? (
                        weatherData.map((cityWeather, index) => (
                            <div key={index} className="bg-white shadow-md rounded-lg p-6">
                                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                                    {cityWeather.city}
                                </h2>
                                <p className="text-lg text-gray-700">🌡 Temperature: {cityWeather.temp} °{cityWeather.temp_unit}</p>
                                <p className="text-lg text-gray-700">☀️ Main Condition: {cityWeather.main}</p>
                                <p className="text-lg text-gray-700">🌬 Feels Like: {cityWeather.feels_like} °{cityWeather.temp_unit}</p>
                                <p className="text-lg text-gray-700">🌡 Max Temperature: {cityWeather.max_temp} °{cityWeather.temp_unit}</p>
                                <p className="text-lg text-gray-700">🌡 Min Temperature: {cityWeather.min_temp} °{cityWeather.temp_unit}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No updates yet. Please wait for real-time data.</p>
                    )}
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full mt-8">
                    <h3 className="text-2xl font-semibold text-blue-600 mb-4">Get Weather Data for Your City</h3>
                    <div className="flex items-center mb-4">
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter city name"
                        />
                        <button
                            onClick={fetchCityWeather}
                            className="ml-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
                        >
                            Get Weather
                        </button>
                    </div>

                    {cityWeather && (
                        <div>
                            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Weather for {cityWeather.city}</h2>
                            <p className="text-lg text-gray-700">🌡 Temperature: {cityWeather.temp} °{cityWeather.temp_unit}</p>
                            <p className="text-lg text-gray-700">☀️ Main Condition: {cityWeather.main}</p>
                            <p className="text-lg text-gray-700">🌬 Feels Like: {cityWeather.feels_like} °{cityWeather.temp_unit}</p>
                            <p className="text-lg text-gray-700">🌡 Max Temperature: {cityWeather.max_temp} °{cityWeather.temp_unit}</p>
                            <p className="text-lg text-gray-700">🌡 Min Temperature: {cityWeather.min_temp} °{cityWeather.temp_unit}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Landing;
