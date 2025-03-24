import React, { useState, useEffect }  from "react";
import axios from "axios";

const App = () => {

  const [stations, setStations] = useState([]); // Store stations
  const [selectedStation, setSelectedStation] = useState(""); // Store selected station

  useEffect(() => {
    axios.get("http://localhost:8080/api/stations") // Replace with your API URL
        .then(response => setStations(response.data))
        .catch(error => console.error("Error fetching stations:", error));
  }, []);

  return (
      <div>
        <h1>Select a Station</h1>
        <select onChange={(e) => setSelectedStation(e.target.value)} value={selectedStation}>
          <option value="">-- Select a Station --</option>
          {stations.map(station => (
              <option key={station.stationId} value={station.stationId}>
                {station.name}
              </option>
          ))}
        </select>
        {selectedStation && <p>You selected: {stations.find(s => s.stationId === selectedStation)?.name}</p>}
      </div>
  );
};

export default App;
