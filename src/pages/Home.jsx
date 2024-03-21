import React, { useState, useEffect } from "react"


export default function Home() {

    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
        cityName: null,
        zipCode: null,
        iata: null,
        ipAddress: null
    })


    useEffect(() => {

        if ("geolocation" in navigator) {

            navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude
                const longitude = position.coords.longitude

                setLocation((currentState) => ({
                    ...currentState,
                    latitude,
                    longitude
                })

                )
            })


        } else {
            console.log("i dont have a loc")
        }

    }, [location])


    return (
        <>
            {location.latitude && (
                    <h1>
                        Weather at current location
                    </h1>

            
                
            )}

        </>
    )
}