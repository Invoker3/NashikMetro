import React, { useState, useEffect }  from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import UserRegistration from "./pages/UserRegistration";
import Home from "./pages/Home";
import axios from "axios";

const App = () => {

    const isAuthenticated = !!localStorage.getItem("token"); // Check if user is logged in

    return (
        <Router>
            <Routes>
                <Route path="/" element={!isAuthenticated ? <UserLogin /> : <Navigate to="/home" />} />
                <Route path="/register" element={!isAuthenticated ? <UserRegistration /> : <Navigate to="/home" />} />
                <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );

  // const [stations, setStations] = useState([]); // Store stations
  // const [selectedStation, setSelectedStation] = useState(""); // Store selected station
  //
  // useEffect(() => {
  //   axios.get("http://localhost:8080/api/stations") // Replace with your API URL
  //       .then(response => setStations(response.data))
  //       .catch(error => console.error("Error fetching stations:", error));
  // }, []);
  //
  // return (
  //     <div>
  //       <h1>Select a Station</h1>
  //       <select onChange={(e) => setSelectedStation(e.target.value)} value={selectedStation}>
  //         <option value="">-- Select a Station --</option>
  //         {stations.map(station => (
  //             <option key={station.stationId} value={station.stationId}>
  //               {station.name}
  //             </option>
  //         ))}
  //       </select>
  //       {selectedStation && <p>You selected: {stations.find(s => s.stationId === selectedStation)?.name}</p>}
  //     </div>
  // );
};

export default App;
