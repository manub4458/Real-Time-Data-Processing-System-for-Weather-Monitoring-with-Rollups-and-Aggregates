const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const weatherRoutes = require('./src/routes/weatherRoutes');
const { fetchWeather, storeWeatherData } = require('./src/services/weatherServices');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
app.use(cors());
app.use('/weather', weatherRoutes);


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));


const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
const temperatureThreshold = 35;
const intervalMinutes = process.env.INTERVAL_MINUTES || 5;
const userPreference = process.env.USER_TEMP_PREFERENCE || 'C';
io.on('connection', async(socket) => {
    console.log('New client connected');
    try {
   
        const data = [];
        for (const city of cities) {
            const weatherData = await fetchWeather(city, userPreference);
            data.push(weatherData);
        }

     
        socket.emit('weatherUpdate', data);
        console.log('Initial weather data sent to new client.');
    } catch (error) {
        console.error('Error fetching initial weather data for new client:', error);
    }

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

setInterval(async () => {
    try {
        const data = [];
        for (const city of cities) {
            const weatherData = await fetchWeather(city, userPreference);
           data.push(weatherData);
   
        }
        io.emit('weatherUpdate', data);
        console.log('Weather data updated.');
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}, intervalMinutes * 60 * 1000);


const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
