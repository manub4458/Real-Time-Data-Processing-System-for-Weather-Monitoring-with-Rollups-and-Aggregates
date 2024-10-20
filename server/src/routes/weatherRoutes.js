const express = require('express');
const { fetchWeather } = require('../services/weatherServices');

const Weather = require('../models/weather.js');

const router = express.Router();


const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
const temperatureThreshold = 35; 


router.get('/summary', async (req, res) => {
    try {
        const summaries = await Weather.aggregate([
            {
                $group: {
                    _id: "$city", 
                    avgTemp: { $avg: "$temp" }, 
                    maxTemp: { $max: "$temp" }, 
                    minTemp: { $min: "$temp" }, 
                    dominantCondition: { $first: "$main" }, 
                }
            },
            {
                $project: {
                    _id: 0, 
                    city: "$_id", 
                    maxTemp: 1,
                    minTemp: 1,
                    dominantCondition: 1
                }
            }
        ]);
        
        res.json(summaries);
    } catch (error) {
        console.error('Error fetching weather summaries:', error);
        res.status(500).json({ error: 'Error fetching weather summaries' });
    }
});

router.get('/search', async (req, res) => {
    try {
        const { city }  = req.query
        const weatherData = await fetchWeather(city);
       
      
        res.json(weatherData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching weather data');
    }
});
router.get('/fetch', async (req, res) => {
    try {
        const data = [];
        
        for (const city of cities) {
            const weatherData = await fetchWeather(city);
            data.push(weatherData);
        }
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching weather data');
    }
});

module.exports = router;
