import axios from 'axios'
import { apiKey } from "../config/config.json"

const BASE_URL = `https://api.weatherapi.com/v1`

export const fetchWeather = async(type, query, days = null, dt = null) => {
    
    try{
        const { data } = await axios.get(`${BASE_URL}/${type}?key=${apiKey}&q=${query}&days=${days}&dt=${dt}`)

        return data
    }
    catch(err) {
        return err
    }
}