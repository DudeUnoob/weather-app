import React, { useState, useEffect } from "react";
import WeatherLocation from "../components/WeatherLocation";
import { fetchWeather } from "../functions/api";

export default function Home() {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
        cityName: null,
        zipCode: null,
        iata: null,
        ipAddress: null
    });

    const [currentWeather, setCurrentWeather] = useState({});

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                setLocation((currentState) => ({
                    ...currentState,
                    latitude,
                    longitude
                }));
            });
        } else {
            console.log("Geolocation is not available.");
        }
    }, []);

    useEffect(() => {
        if (location.latitude && location.longitude) {
            fetchWeather('current.json', `${parseFloat(location.latitude)},${parseFloat(location.longitude)}`).then((data) => {
                setCurrentWeather(data);
            });
        }
    }, [location.latitude, location.longitude]);

    return (
        <>
            {location.latitude ? (
                <>
                    <h1>
                        Weather at current location
                        
                    </h1>
                    <br />
                    <WeatherLocation />
                    {currentWeather.current ? (
                        <p>
                            Today's date: {currentWeather.current?.last_updated}
                            <br />

                            Weather Condition: {currentWeather.current?.condition.text}
                            <br />
                            <img src={currentWeather.current?.condition.icon}/>
                            <br />
                            <p>Cloudy: {currentWeather.current?.cloud}</p>
                            Temperature: {currentWeather.current?.temp_f} °F / {currentWeather.current?.temp_c + "°C"}
                            <br />
                            Precipitation: {currentWeather.current?.precip_mm} mm
                            <br />
                            Pressure: {currentWeather.current?.pressure_in} in Hg
                            <br />
                            Visibility: {currentWeather.current?.vis_miles} mi
                            <br />
                            Wind Degree: {currentWeather.current?.wind_degree} degrees
                            <br />
                            Wind Speed: {currentWeather.current?.wind_mph} mph
                        </p>
                    ) : <p>Loading...</p>}
                </>
            ) : (
                <>
                    <WeatherLocation />
                </>
            )}
        </>
    );
}
