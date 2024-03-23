import React, { useState, useContext } from "react";

const WeatherContext = React.createContext();
const WeatherUpdateContext = React.createContext();



export function useUpdateSearchedLocation() {
    return useContext(WeatherUpdateContext);
}

export function getSearchedLocation() {
    return useContext(WeatherContext);
}

export const WeatherProvider = ({ children }) => {
    const [searchedLocation, setSearchedLocation] = useState({});

    const updateSearchedLocation = (location) => {
        setSearchedLocation(location);
    };

    return (
        <WeatherContext.Provider value={searchedLocation}>
            <WeatherUpdateContext.Provider value={updateSearchedLocation}>
                {children}
            </WeatherUpdateContext.Provider>
        </WeatherContext.Provider>
    );
};
