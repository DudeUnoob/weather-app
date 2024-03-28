import React, { useState, useEffect } from "react";
import WeatherLocation from "../components/WeatherLocation";
import { fetchWeather } from "../functions/api";
import { Card, ListGroup } from "react-bootstrap";
import { useUpdateSearchedLocation, getSearchedLocation } from "../context/WeatherContext";



export default function Home() {
    const fetchSearchedLocation = getSearchedLocation()

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
        if (Object.keys(fetchSearchedLocation).length > 0) {

            const originalObj = { lat: fetchSearchedLocation.lat, lon: fetchSearchedLocation.lon, name: fetchSearchedLocation.name }

            const keyMap = {
                lat: "latitude",
                lon: "longitude",
                name: "cityName"

            }

            const newObj = {}

            for (const [oldKey, newKey] of Object.entries(keyMap)) {
                newObj[newKey] = originalObj[oldKey]
            }


            setLocation((currentState) => {
                return { ...newObj }
            }
            )
        }

        else if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                setLocation((currentState) => ({
                    ...currentState,
                    latitude,
                    longitude
                }));


                localStorage.setItem("currentLocation", JSON.stringify({ latitude: latitude, longitude: longitude }))
            });
        } else {
            console.log("Geolocation is not available.");
        }

        console.log(fetchSearchedLocation)

    }, [fetchSearchedLocation]);

    useEffect(() => {
        if (location.latitude && location.longitude) {
            fetchWeather('current.json', `${parseFloat(location.latitude)},${parseFloat(location.longitude)}`).then((data) => {
                setCurrentWeather(data);
            });
        }
    }, [location.latitude, location.longitude]);


    const handleLocationReset = () => {
        const currentLocation = localStorage.getItem("currentLocation");
        if (currentLocation) {
            const { latitude, longitude } = JSON.parse(currentLocation);
            setLocation((currentState) => ({
                ...currentState,
                latitude,
                longitude,
            }));
        }
    };

    return (
        <>
            {location.latitude ? (
                <>
                    <div className="header-comp" style={{ display: "flex", justifyContent: "space-evenly", flexDirection: "column", alignContent: "stretch", alignItems: "center", flexWrap: "nowrap" }}>
                        <h1>
                            Weather App

                        </h1>


                        <button style={{
                            background: "none", border: "none", padding: 0, outline: 'inherit', color: "inherit", font: "inherit", justifyContent: "center"


                        }} onClick={handleLocationReset}>
                            <i className='fa fa-home' style={{ fontSize: "36px", cursor: "pointer" }}></i>
                            <p>Get weather at current location</p>
                        </button>

                    </div>


                    <br />

                    <WeatherLocation />
                    {console.log(currentWeather.current)}
                    {currentWeather.current ? (
                        <div className="weather-card-container" style={{ display: "flex", justifyContent: "center", padding: "0 25px 25px 25px" }}>
                            <Card style={{ width: "50rem", }}>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <Card.Img
                                        src={currentWeather?.current?.condition?.icon}
                                        variant="top"
                                        style={{ width: "15%", margin: "0 auto" }}
                                    />
                                </div>
                                <Card.Body>
                                    <Card.Title>
                                        Current Weather in {currentWeather?.location?.name}, {currentWeather?.location?.region}, {currentWeather?.location?.country} - {currentWeather.current?.last_updated}
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