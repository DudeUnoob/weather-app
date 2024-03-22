import React, { useState, useRef } from "react";
import { fetchWeather } from "../functions/api";

export default function WeatherLocation() {
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const debounceTimer = useRef(null);
    const inputRef = useRef(null);


    const debounce = (func, delay) => {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(func, delay);
    };

    const fetchData = async (query) => {
        setIsLoading(true);
        try {
            const data = await fetchWeather(`search.json`, query);
            setSearchResults(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const query = e.target.value;
        debounce(() => {
            if (query.trim() !== '') {
                fetchData(query);
            } else {
                setSearchResults([]);
            }
        }, 500);
    };

    return (
        <div className="weather-location-input">
            <input
                type="text"
                name="search_location"
                ref={inputRef}
                placeholder="Enter location..."
                onChange={handleInputChange}
            />

            {isLoading && <p>Loading...</p>}
            <ul>
                {searchResults?.map((result) => (
                    <li key={result.id}>{result.name}, {result.region}, {result.country}</li>
                ))}
            </ul>
        </div>
    );
}
