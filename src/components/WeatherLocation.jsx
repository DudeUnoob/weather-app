import React, { useState, useRef, useCallback, useMemo } from "react";
import { fetchWeather } from "../functions/api";
import { useUpdateSearchedLocation, getSearchedLocation } from "../context/WeatherContext";
import { Form, FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import WeatherLocationStyles from "../css/WeatherLocation.module.css"

export default function WeatherLocation() {
    const [searchResults, setSearchResults] = useState([]);
    const [currentActiveLocation, setCurrentActiveLocation] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const debounceTimer = useRef(null);
    const inputRef = useRef(null);

    const updateSearchedLocation = useUpdateSearchedLocation();
    const fetchSearchedLocation = getSearchedLocation()

    const handleLocationChange = useCallback((result) => {
        updateSearchedLocation(result);
        setCurrentActiveLocation(result)
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
        <div className="weather-location-input" style={{ 
            display: 'flex',
            placeContent:"center",
            flexFlow:"column-wrap",
            justifyContent:"center",
            alignItems:"center",
            alignContent:'center',
            flexDirection:"column"

        }}>
            {/* <input
                type="text"
                name="search_location"
                ref={inputRef}
                placeholder="Enter location..."
                onChange={handleInputChange}
            /> */}
        <FormControl style={{ width:"300px", maxWidth: "100%", overflow: "hidden" }} ref={inputRef} type="text" placeholder="Enter location..." onChange={handleInputChange}/>

            <br />

            {isLoading && <p>Loading...</p>}
            <ListGroup>
                {searchResults?.map((result) => (
                    <ListGroup.Item key={result.id} onClick={() => {
                        handleLocationChange(result)
                    }} 
                   
                    className={currentActiveLocation?.id != result?.id ? WeatherLocationStyles.list_group_item : null}
                    active={currentActiveLocation?.id == result?.id}
                    
                    >{result.name}, {result.region}, {result.country}</ListGroup.Item>
                ))}
            </ListGroup>
        </div>

        <br />
            <br />
        </>
    );
}