import React, { useState, useEffect } from "react";
import WeatherLocation from "../components/WeatherLocation";
import { fetchWeather } from "../functions/api";
import { Card, ListGroup } from "react-bootstrap";

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
                        <div className="weather-card-container">
                            <Card style={{ width: "18rem" }}>
                                <Card.Img src={currentWeather?.current.condition.icon} variant="top" />
                                <Card.Body>
                                    <Card.Title>
                                        Current Weather - {currentWeather.current?.last_updated}
                                    </Card.Title>
                                    <Card.Text>
                                        {currentWeather.current.condition.text}
                                    </Card.Text>

                                    <ListGroup className="list-group-weather-info">
                                        <ListGroup.Item>Cloudy: {currentWeather.current?.cloud}</ListGroup.Item>
                                        <ListGroup.Item>Temperature: {currentWeather.current?.temp_f} °F / {currentWeather.current?.temp_c + "°C"}</ListGroup.Item>
                                        <ListGroup.Item>Precipitation: {currentWeather.current?.precip_mm} mm</ListGroup.Item>
                                        <ListGroup.Item>Pressure: {currentWeather.current?.pressure_in} in Hg</ListGroup.Item>
                                        <ListGroup.Item>Visibility: {currentWeather.current?.vis_miles} mi</ListGroup.Item>
                                        <ListGroup.Item>Wind Degree: {currentWeather.current?.wind_degree} degrees</ListGroup.Item>
                                        <ListGroup.Item>Wind Speed: {currentWeather.current?.wind_mph} mph</ListGroup.Item>
                                    </ListGroup>
                                </Card.Body>
                            </Card>




                        </div>

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
