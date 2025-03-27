import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [stations, setStations] = useState([]);
    const [selectedStation, setSelectedStation] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStations = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/stations", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setStations(response.data);
            } catch (error) {
                alert("Failed to fetch stations.");
            }
        };
        fetchStations();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div>
            <h2>Select Your Station</h2>
            <select onChange={(e) => setSelectedStation(e.target.value)}>
                <option value="">Select a station</option>
                {stations.map((station) => (
                    <option key={station.stationId} value={station.name}>
                        {station.name}
                    </option>
                ))}
            </select>
            <p>Selected Station: {selectedStation}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Home;
