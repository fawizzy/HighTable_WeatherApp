"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [searchText, setSearchText] = useState("");
  const [celcius, setCelsius] = useState(true);
  const [mb, setMB] = useState(true);
  const [mph, setMPH] = useState(true);
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [locationData, setLocationData] = useState({
    name: "",
    country: "",
    localtime: "",
  });
  const [weather, setWeather] = useState({
    temp_c: 0.0,
    temp_f: 0.0,
    wind_mph: 0.0,
    wind_kph: 0.0,
    wind_degree: 0,
    pressure_mb: 0.0,
    pressure_in: 0.0,
    humidity: 0,
    cloud: 0,
    uv: 0,
  });
  useEffect(() => {
    getUserDataFromToken();
  }, []);

  const getWeather = async (location: string) => {
    const data = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${location}&aqi=no`
    );
    setWeather(data.data.current);
    setLocationData(data.data.location);
  };
  async function getUserDataFromToken() {
    const axios = require("axios");

    const apiUrl = "/api/graphql";

    const userByTokenQuery = `
      query UserByToken($token: String) {
        userByToken(token: $token) {
          email
          location
        }
      }
    `;

    const userByTokenVariables = {
      token: getFromLocalStorage(),
    };

    axios
      .post(
        apiUrl,
        {
          query: userByTokenQuery,
          variables: userByTokenVariables,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response: any) => {
        const location = response.data.data.userByToken.location;

        const email = response.data.data.userByToken.email;
        setEmail(email);
        setLocation(location);
        getWeather(location);
      })
      .catch((error: any) => {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      });
  }
  async function saveLocation() {
    const apiUrl = "/api/graphql";

    const updateUserMutation = `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      location
      email
    }
  }
`;

    const updateUserVariables = {
      input: {
        email,
        location: locationData.name,
      },
    };

    // console.log(updateUserVariables);

    axios
      .post(
        apiUrl,
        {
          query: updateUserMutation,
          variables: updateUserVariables,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      });
  }

  const toggleUnits = () => {
    setCelsius((prevIsCelsius) => !prevIsCelsius);
    setMPH((prevMPH) => !prevMPH);
    setMB((prevMB) => !prevMB);
  };
  function getFromLocalStorage() {
    return localStorage.getItem("token");
  }
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">Weather App</h1>
      <button
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={toggleUnits}
      >
        Switch Units
      </button>
      <div className="flex justify-end mb-4">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={saveLocation}
        >
          Save Current Location
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter location"
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          className="border p-2 rounded-md"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-2 rounded"
          onClick={(e) => getWeather(searchText)}
        >
          Search
        </button>
      </div>
      <div className="flex">
        <div className="w-1/2 p-4 border rounded-md mr-4">
          {/* <h2 className="text-xl font-bold mb-4">Location</h2> */}
          <div className="grid grid-cols-2 gap-4">
            <p>
              <strong>Location</strong>
              <br /> {locationData.name}, {locationData.country}
            </p>

            <p>
              <strong>Date</strong>
              <br /> {locationData.localtime.slice(0, 10)}
            </p>
            <p>
              <strong>Time</strong> <br />{" "}
              {locationData.localtime.slice(11, 16)}
            </p>
          </div>
        </div>
        <div className="w-1/2 p-4 border rounded-md">
          {/* <h2 className="text-xl font-bold mb-4">Current Weather</h2> */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>
                {celcius ? (
                  <strong>Temperature (°C):</strong>
                ) : (
                  <strong>Temperature (F):</strong>
                )}
                <br /> {celcius ? weather.temp_c : weather.temp_f}
              </p>
            </div>
            <div>
              <p>
                {mph ? (
                  <strong>Wind Speed (mph):</strong>
                ) : (
                  <strong>Wind Speed (kph):</strong>
                )}
                <br />
                {mph ? weather.wind_mph : weather.wind_kph}
              </p>
            </div>
            <div>
              <p>
                <strong>Wind Degree:</strong> <br />
                {weather.wind_degree}
              </p>
            </div>
            <div>
              <p>
                {mb ? (
                  <strong>Pressure (mb):</strong>
                ) : (
                  <strong>Pressure (in):</strong>
                )}{" "}
                <br />
                {mb ? weather.pressure_mb : weather.pressure_in}
              </p>
            </div>
            <div>
              <p>
                <strong>Humidity:</strong> <br />
                {weather.humidity}
              </p>
            </div>
            <div>
              <p>
                <strong>UV Index</strong> <br />
                {weather.uv}
              </p>
            </div>
            <div>
              <p>
                <strong>Cloud</strong> <br /> {2.0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
