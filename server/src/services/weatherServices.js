const axios = require('axios');
const Weather = require('../models/weather.js');

function kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
}


function kelvinToFahrenheit(kelvin) {
    return (kelvin - 273.15) * 9/5 + 32;
}


async function fetchWeather(city, userPreference = 'C') {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}`;
    const response = await axios.get(url);
    const data = response.data;

 
    let temp = kelvinToCelsius(data.main.temp);
    let feels_like = kelvinToCelsius(data.main.feels_like);
    let max_temp = kelvinToCelsius(data.main.temp_max);
    let min_temp = kelvinToCelsius(data.main.temp_min);

    if (userPreference === 'F') {
        temp = kelvinToFahrenheit(data.main.temp);
        feels_like = kelvinToFahrenheit(data.main.feels_like);
        max_temp = kelvinToFahrenheit(data.main.temp_max);
        min_temp = kelvinToFahrenheit(data.main.temp_min);
    }

    const weatherData = {
        city: city,
        main: data.weather[0].main,
        temp: temp,
        feels_like: feels_like,
        max_temp: max_temp,
        min_temp: min_temp,
        timestamp: new Date(data.dt * 1000)
    };
    const weatherEntry = new Weather(
    weatherData
    );

 
    await weatherEntry.save();
    
    return weatherData;
}

module.exports = { fetchWeather };
