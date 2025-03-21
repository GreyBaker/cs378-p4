import './App.css';
import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // This imports bootstrap css styles. You can use bootstrap or your own classes by using the className attribute in your elements.
import { fetchWeatherApi } from "openmeteo";

const cityCoordinates = {
  "Dallas": {latitude: 32.78, longitude: -96.81},
  "Houston": {latitude: 29.76, longitude:-95.36},
  "Austin": {latitude: 30.27, longitude: -97.74},
  "El Paso": {latitude: 31.76, longitude: -106.49},
};

const WeatherApp = () => {
  const [mode, setMode] = useState("Temperature");
  const [cityName, setCity] = useState("El Paso");
  const [output, setOutput] = useState("uninitialized");

  const fetchWeatherData = async () => {
    if (!cityCoordinates[cityName]) {
      alert("Unknown City Name -- only city options are 'Dallas', 'Houston', 'Austin', 'El Paso'");
      return;
    }

    const params = {
      "latitude": cityCoordinates[cityName].latitude,
      "longitude": cityCoordinates[cityName].longitude,
      "hourly": ["temperature_2m", "rain", "wind_speed_10m"],
      "forecast_days": 1,
      "wind_speed_unit": "mph",
      "temperature_unit": "fahrenheit",
      "precipitation_unit": "inch"
    };
    const url = "https://api.open-meteo.com/v1/forecast";

    try {
      setOutput("starting fetch")
      const responses = await fetchWeatherApi(url, params);
      const response = responses[0];
      const hourly = response.hourly();
      const weatherData = {
        "Temperature": hourly.variables(0)?.valuesArray()[0].toFixed(1) + " °F",
        "Rainfall": hourly.variables(1)?.valuesArray()[0].toFixed(1) + " inch(es)",
        "Wind": hourly.variables(2)?.valuesArray()[0].toFixed(1) + " mph",
      };
      setOutput(weatherData[mode]);
    } catch (error) {
      setOutput("error fetching weather data");
    }
  };

  // Unclear why combining the set and fetch step doesn't display well, but it doesn't

  return (
    <div className="container text-center mt-5">
      <h1>Weather App</h1>

      <p/>
      
      <div className="row">
        <div className="col">
          <h2>Enter City</h2>
          <input type="text" className="form-control" placeholder="City Name Here" value={cityName} onChange={(e) => setCity(e.target.value)} />
        </div>
      </div>

      <p/>
      <h2>Select Mode</h2>

      <div className="row">
        <div className="col-4">
          <button type="button" class="btn" id="mode-button" onClick={() => setMode("Temperature")}>Temperature</button>
        </div>
        <div className="col-4">
        <button type="button" class="btn" id="mode-button" onClick={() => setMode("Rainfall")}>Rainfall</button>
        </div>
        <div className="col-4">
        <button type="button" class="btn" id="mode-button" onClick={() => setMode("Wind")}>Wind</button>
        </div>
      </div>

      <p/>
      <div className="row">
        <div className="col">
          <button className="btn btn-primary" onClick={fetchWeatherData}>Fetch Weather: {mode}</button>
        </div>
      </div>

      <p/>
      <p id="text-output">{output}</p>
    </div>
  );
};

export default WeatherApp;

