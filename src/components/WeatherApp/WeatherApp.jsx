import React, { useState, useEffect, useCallback, useRef } from "react";
import './WeatherApp.css';

import search_icon from "../Assets/search.png";
import clear_icon from "../Assets/clear.png";
import cloud_icon from "../Assets/cloud.png";
import drizzle_icon from "../Assets/drizzle.png";
import rain_icon from "../Assets/rain.png";
import snow_icon from "../Assets/snow.png";
import wind_icon from "../Assets/wind.png";
import humidity_icon from "../Assets/humidity.png";

const WeatherApp = () => {
    let apiKey = process.env.REACT_APP_API_KEY;

    const [wicon, setWicon] = useState(cloud_icon);
    const [weatherData, setWeatherData] = useState(null);
    const [hourlyForecast, setHourlyForecast] = useState([]);
    const [dailyForecast, setDailyForecast] = useState([]);

    const inputRef = useRef(null);

    const search = useCallback(async (city) => {
        const cityName = city || inputRef.current.value || "New York";

        // Fetch current weather data
        let currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
        let currentWeatherResponse = await fetch(currentWeatherUrl);
        let currentWeatherData = await currentWeatherResponse.json();
        setWeatherData(currentWeatherData);

        // Clear the input field
        inputRef.current.value = "";
    }, []);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            search(inputRef.current.value);
        }
    };

    const getWeatherIcon = (iconCode) => {
        switch (iconCode) {
            case "01d":
            case "01n":
                return clear_icon;
            case "02d":
            case "02n":
                return cloud_icon;
            case "03d":
            case "03n":
            case "04d":
            case "04n":
                return drizzle_icon;
            case "09d":
            case "09n":
            case "10d":
            case "10n":
                return rain_icon;
            case "13d":
            case "13n":
                return snow_icon;
            default:
                return cloud_icon;
        }
    };

    useEffect(() => {
        // Fetch data for New York when the component mounts
        search("New York");
    }, [search]);

    useEffect(() => {
        if (weatherData) {
            // Set weather icon based on weather conditions
            if (weatherData.weather[0].icon === "01d" || weatherData.weather[0].icon === "01n") {
                setWicon(clear_icon);
            } else if (weatherData.weather[0].icon === "02d" || weatherData.weather[0].icon === "02n") {
                setWicon(cloud_icon);
            } else if (weatherData.weather[0].icon === "03d" || weatherData.weather[0].icon === "03n") {
                setWicon(drizzle_icon);
            } else if (weatherData.weather[0].icon === "04d" || weatherData.weather[0].icon === "04n") {
                setWicon(drizzle_icon);
            } else if (weatherData.weather[0].icon === "09d" || weatherData.weather[0].icon === "09n") {
                setWicon(rain_icon);
            } else if (weatherData.weather[0].icon === "10d" || weatherData.weather[0].icon === "10n") {
                setWicon(rain_icon);
            } else if (weatherData.weather[0].icon === "13d" || weatherData.weather[0].icon === "13n") {
                setWicon(snow_icon);
            } else {
                setWicon(cloud_icon);
            }
        }
    }, [weatherData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cityName = inputRef.current.value || "New York";
    
                // Fetch hourly forecast data
                let hourlyUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${process.env.REACT_APP_API_KEY}`;
                console.log("Hourly URL:", hourlyUrl);
                let hourlyResponse = await fetch(hourlyUrl);
                let hourlyData = await hourlyResponse.json();
                console.log("Hourly Data:", hourlyData);
    
                hourlyData.list.sort((a, b) => a.dt - b.dt);
    
                // Filter the hourly forecast to show only the next 8 hours from the current time
                const currentTime = Math.floor(new Date().getTime() / 1000);
                const next8HoursForecast = hourlyData.list.filter(hour => hour.dt >= currentTime && hour.dt <= currentTime + 8 * 60 * 60);
    
                // Fetch daily forecast data
                let dailyUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${cityName}&cnt=7&units=metric&appid=${apiKey}`;
                console.log("Daily URL:", dailyUrl);
                let dailyResponse = await fetch(dailyUrl);
                let dailyData = await dailyResponse.json();
                console.log("Daily Data:", dailyData);
    
                // Extract relevant data for each day
                const dailyForecast = dailyData.list.map(day => ({
                    date: new Date(day.dt * 1000).toLocaleDateString(),
                    icon: getWeatherIcon(day.weather[0].icon),
                    temp: Math.floor(day.temp.day),
                }));
    
                setDailyForecast(dailyForecast);
                // If there are less than 8 hours available, fill the remaining slots with forecasts from the next day
                const remainingSlots = 8 - next8HoursForecast.length;
                if (remainingSlots > 0) {
                    const nextDayForecast = hourlyData.list.filter(hour => hour.dt >= currentTime + 24 * 60 * 60);
                    setHourlyForecast([...next8HoursForecast, ...nextDayForecast.slice(0, remainingSlots)]);
                } else {
                    setHourlyForecast(next8HoursForecast);
                }
            } catch (error) {
                console.error("Error fetching hourly forecast:", error);
            }
        };
    
        fetchData();
    }, [search]);
    

    return (
        <div className="container">
            <div className="top-bar">
                <input
                    type="text"
                    className="cityInput"
                    placeholder="Search"
                    ref={inputRef}
                    onKeyPress={handleKeyPress}
                />
                <div className="search-icon" onClick={() => search(inputRef.current.value)}>
                    <img src={search_icon} alt="" />
                </div>
            </div>
            <div className="weather-image">
                <img src={wicon} alt="" />
            </div>
            <div className="weather-location">{weatherData && weatherData.name}</div>
            <div className="weather-temp">{weatherData && Math.floor(weatherData.main.temp)}&deg;C</div>

            <div className="data-container">
                <div className="element">
                    <img src={humidity_icon} alt="" className="icon" />
                    <div className="data">
                        <div className="humidity-percent">{weatherData && `${weatherData.main.humidity} %`}</div>
                        <div className="text">Humidity</div>
                    </div>
                </div>
                <div className="element">
                    <img src={wind_icon} alt="" className="icon" />
                    <div className="data">
                        <div className="wind-rate">{weatherData && `${Math.floor(weatherData.wind.speed)} km/h`}</div>
                        <div className="text">Wind speed</div>
                    </div>
                </div>
            </div>

            {/* Display hourly forecast */}
            <div className="hourly-forecast">
                {hourlyForecast.map((hour, index) => (
                    <div key={index} className="hourly-forecast-item">
                        <div>{new Date(hour.dt * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true })}</div>
                        <img src={getWeatherIcon(hour.weather[0].icon)} alt="" />
                        <div>{Math.floor(hour.main.temp)}&deg;C</div>
                    </div>
                ))}
            </div>
            <div className="daily-forecast">
                {dailyForecast.map((day, index) => (
                    <div key={index} className="daily-forecast-item">
                        <div>{day.date}</div>
                        <img src={day.icon} alt="" />
                        <div>{day.temp}&deg;C</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeatherApp;
