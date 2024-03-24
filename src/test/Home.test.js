import React from 'react';
import { render, fireEvent, within, screen, waitFor } from '@testing-library/react';
import Home from "../pages/Home";


test("Enter Location Input form shown if geolocation is not available", async () => {
    const renderedComponent = render(<Home />);
    const loadingText = await screen.findByPlaceholderText("Enter location...")
    expect(loadingText).toBeInTheDocument();
});
