"use client"
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Summary = () => {
    const [dailySummaries, setDailySummaries] = useState([]);

    useEffect(() => {
        async function fetchDailySummaries() {
            try {
                const response = await axios.get('http://localhost:8000/weather/summary');
                setDailySummaries(response.data);
            } catch (error) {
                console.error('Error fetching daily summaries:', error);
            }
        }
        fetchDailySummaries();
    }, []);

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-4">Daily Weather Summaries</h1>

            {/* Line chart for temperature trends */}
            <h2 className="text-xl font-semibold mt-8">Temperature Trends</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dailySummaries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="city" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avgTemp" stroke="#8884d8" activeDot={{ r: 8 }} name="Avg Temp" />
                    <Line type="monotone" dataKey="maxTemp" stroke="#82ca9d" name="Max Temp" />
                    <Line type="monotone" dataKey="minTemp" stroke="#ff7300" name="Min Temp" />
                </LineChart>
            </ResponsiveContainer>

            {/* Alert for high temperatures */}
            <ul className="list-disc pl-5">
                {dailySummaries.map((summary, index) => (
                    summary.maxTemp > 35 && (
                        <li key={index} className="text-red-600">
                            Alert: High temperature in {summary.city} (Max: {summary.maxTemp ? summary.maxTemp.toFixed(1) : 'N/A'}°C)
                        </li>
                    )
                ))}
            </ul>

            {/* Daily Summaries by City */}
            <h2 className="text-xl font-semibold mt-8">Daily Summaries by City</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dailySummaries.map((summary) => (
                    <div key={summary.city} className="border rounded-lg p-4 shadow-md">
                        <h3 className="text-lg font-semibold">{summary.city}</h3>
                        <p>🌡 Avg Temp: {summary.avgTemp ? summary.avgTemp.toFixed(1) : 'N/A'}°C</p>
                        <p>🌡 Max Temp: {summary.maxTemp ? summary.maxTemp.toFixed(1) : 'N/A'}°C</p>
                        <p>🌡 Min Temp: {summary.minTemp ? summary.minTemp.toFixed(1) : 'N/A'}°C</p>
                        <p>☀️ Dominant Condition: {summary.dominantCondition || 'N/A'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Summary;
