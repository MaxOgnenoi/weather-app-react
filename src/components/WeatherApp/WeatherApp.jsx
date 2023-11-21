import React, { useState, useEffect, useCallback, useRef } from "react";
import './WeatherApp.css'

import search_icon from "../Assets/search.png"
import clear_icon from "../Assets/clear.png"
import cloud_icon from "../Assets/cloud.png"
import drizzle_icon from "../Assets/drizzle.png"
import rain_icon from "../Assets/rain.png"
import snow_icon from "../Assets/snow.png"
import wind_icon from "../Assets/wind.png"
import humidity_icon from "../Assets/humidity.png"

const WeatherApp = () => {
    let apiKey = process.env.REACT_APP_API_KEY;

    const [wicon, setWicon] = useState(cloud_icon);
    const [defaultCity] = useState("New York");
    const [weatherData, setWeatherData] = useState(null);
    const inputRef = useRef(null);

    const search = useCallback(async (city) => {
        const element = document.getElementsByClassName("cityInput");
        if (element[0].value === "" && !city) {
            return 0;
        }
        const cityName = city || element[0].value || "New York";

        let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
        let response = await fetch(url);
        let data = await response.json();
        setWeatherData(data);

        const humidity = document.getElementsByClassName("humidity-percent");
        const wind = document.getElementsByClassName("wind-rate");
        const temperature = document.getElementsByClassName("weather-temp");
        const location = document.getElementsByClassName("weather-location");

        if (humidity[0] && wind[0] && temperature[0] && location[0]) {
            humidity[0].innerHTML = data.main.humidity + " %";
            wind[0].innerHTML = Math.floor(data.wind.speed) + " km/h";
            temperature[0].innerHTML = Math.floor(data.main.temp) + "°C";
            location[0].innerHTML = data.name;
        }

        if (data.weather[0].icon === "01d" || data.weather[0].icon === "01n") {
            setWicon(clear_icon)
        } else if (data.weather[0].icon === "02d" || data.weather[0].icon === "02n") {
            setWicon(cloud_icon)
        } else if (data.weather[0].icon === "03d" || data.weather[0].icon === "03n") {
            setWicon(drizzle_icon)
        } else if (data.weather[0].icon === "04d" || data.weather[0].icon === "04n") {
            setWicon(drizzle_icon)
        } else if (data.weather[0].icon === "09d" || data.weather[0].icon === "09n") {
            setWicon(rain_icon)
        } else if (data.weather[0].icon === "10d" || data.weather[0].icon === "10n") {
            setWicon(rain_icon)
        } else if (data.weather[0].icon === "13d" || data.weather[0].icon === "13n") {
            setWicon(snow_icon)
        } else {
            setWicon(clear_icon)
        }
    }, [apiKey]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            search(inputRef.current.value); // Trigger search when Enter key is pressed
        }
    };

    useEffect(() => {
        // Fetch data for New York when the component mounts
        search(defaultCity);
    }, [defaultCity, search]);

    return (
        <div className="container">
            <div className="top-bar">
                <input type="text" className="cityInput" placeholder="Search"
                    ref={inputRef} 
                    onKeyPress={handleKeyPress} />
                <div className="search-icon" onClick={() => { search() }}>
                    <img src={search_icon} alt="" />
                </div>
            </div>
            <div className="weather-image">
                <img src={wicon} alt="" />
            </div>
            {weatherData && (
                <div>
                    <div className="weather-location">{weatherData.name}</div>
                    <div className="weather-temp">{Math.floor(weatherData.main.temp)}&deg;C</div>
                    <div className="data-container">
                        <div className="element">
                            <img src={humidity_icon} alt="" className="icon" />
                            <div className="data">
                                <div className="humidity-percent">{weatherData.main.humidity} %</div>
                                <div className="text">Humidity</div>
                            </div>
                        </div>
                        <div className="element">
                            <img src={wind_icon} alt="" className="icon" />
                            <div className="data">
                                <div className="wind-rate">{Math.floor(weatherData.wind.speed)} km/h</div>
                                <div className="text">Wind speed</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default WeatherApp;
