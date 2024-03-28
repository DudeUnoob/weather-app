import React, { useState, useRef, useCallback, useMemo } from "react";
import { fetchWeather } from "../functions/api";
import { useUpdateSearchedLocation, getSearchedLocation } from "../context/WeatherContext";

export default function WeatherLocation() {
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const debounceTimer = useRef(null);
    const inputRef = useRef(null);

    const updateSearchedLocation = useUpdateSearchedLocation();
    const fetchSearchedLocation = getSearchedLocation()

    const handleLocationChange = useCallback((result) => {
        updateSearchedLocation(result);
    }, [updateSearchedLocation]);

    const debounce = useCallback((func, delay) => {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(func, delay);
    }, []);


    const fetchData = useCallback(async (query) => {
        setIsLoading(true);
        try {
            const data = await fetchWeather(`search.json`, query);
            setSearchResults(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleInputChange = useCallback((e) => {
        const query = e.target.value;
        debounce(() => {
            if (query.trim() !== '') {
                fetchData(query);
            } else {
                setSearchResults([]);
            }
        }, 500);
    }, [debounce, fetchData]);

    return (
        <>
        <div className="weather-location-input" style={{ display:"flex", justifyContent:'center', flexDirection:"column", flexWrap:"wrap", alignContent:"center"}}>
            <input
                type="text"
                name="search_location"
                ref={inputRef}
                placeholder="Enter location..."
                onChange={handleInputChange}
            />

            <br />

            {isLoading && <p>Loading...</p>}
            <ul>
                {searchResults?.map((result) => (
                    <li key={result.id} onClick={() => handleLocationChange(result)} style={{ cursor: "pointer" }}>{result.name}, {result.region}, {result.country}</li>
                ))}
            </ul>
        </div>
        <br />
            <br />
        </>
    );
}