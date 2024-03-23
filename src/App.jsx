import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import { WeatherProvider } from './context/WeatherContext';

function App() {
  return (
    <BrowserRouter>
    <WeatherProvider>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      </WeatherProvider>
    </BrowserRouter>
  );
}

export default App;
