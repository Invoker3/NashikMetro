import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Autocomplete,
    Button,
    TextField,
    Box,
    Typography,
    Paper,
    AppBar,
    Toolbar,
    IconButton,
    Snackbar,
    Alert
} from "@mui/material";
import DirectionsSubwayIcon from '@mui/icons-material/DirectionsSubway';
import LogoutIcon from '@mui/icons-material/Logout';
import JourneyMap from './JourneyMapComponent';
import metroLinesData from '../metro_lines_data';

const Home = ({ isAuthenticated, setAuth }) => {
    const [stations, setStations] = useState([]);
    const [startStation, setStartStation] = useState(null);
    const [endStation, setEndStation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSelecting, setIsSelecting] = useState('start');
    const navigate = useNavigate();

    useEffect(() => {
        const allStationsMap = new Map();
        Object.values(metroLinesData).forEach(line => {
            line.stations.forEach(station => {
                if (!allStationsMap.has(station.id)) {
                    allStationsMap.set(station.id, {
                        stationId: station.id,
                        name: station.name,
                        lat: station.lat,
                        lon: station.lng
                    });
                }
            });
        });
        setStations(Array.from(allStationsMap.values()));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setAuth(false);
    };

    const handleMapStationSelect = (station, target) => {
        if (station === null) { // Reset functionality: if station is null, clear selections
            setStartStation(null);
            setEndStation(null);
            setIsSelecting('start'); // Reset to selecting start station
            return;
        }

        if (target === 'start' || (!target && isSelecting === 'start')) {
            setStartStation(station);
            if (!endStation) { // Only auto-advance if end station is not yet set
                setIsSelecting('end');
            }
        } else {
            setEndStation(station);
        }
    };

    const handleBookJourney = async () => {
        if (!startStation || !endStation) {
            setError("Please select both a start and end station.");
            return;
        }
        if (startStation.stationId === endStation.stationId) {
            setError("Start and end stations cannot be the same.");
            return;
        }
        if (localStorage.getItem("balance") < 5) {
            setError("You do not have enough balance to book this journey.");
            return;
        }

        setIsLoading(true);
        setError("");
        try {
            const response = await axios.post(
                "http://localhost:8080/api/users/purchase-ticket",
                {
                    userId: localStorage.getItem("userId"),
                    startStationId: startStation.stationId,
                    endStationId: endStation.stationId
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            navigate("/confirmation", { state: { ticket: response.data } });
        } catch (err) {
            setError(err.response?.data?.message || "Booking failed. Please check your selection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <AppBar position="static" sx={{ background: 'rgba(25, 118, 210, 0.95)', backdropFilter: 'blur(5px)' }}>
                <Toolbar>
                    <DirectionsSubwayIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        SubwayBooker
                    </Typography>
                    {isAuthenticated && (
                        <IconButton color="inherit" onClick={handleLogout} title="Logout">
                            <LogoutIcon />
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>
            
            <Box sx={{ position: 'relative', flexGrow: 1 }}>
                <JourneyMap
                    stations={stations}
                    onStationSelect={handleMapStationSelect}
                    startStation={startStation}
                    endStation={endStation}
                />
                <Paper
                    elevation={8}
                    sx={{
                        position: 'absolute',
                        top: 20,
                        left: 20,
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 1000,
                        width: 'calc(100% - 40px)',
                        maxWidth: '450px'
                    }}
                >
                    <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Select Your Journey
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Autocomplete
                            value={startStation}
                            options={stations}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, newValue) => setStartStation(newValue)}
                            renderInput={(params) => <TextField {...params} label="Start Station" variant="outlined" onFocus={() => setIsSelecting('start')} />}
                        />
                        <Autocomplete
                            value={endStation}
                            options={stations.filter(s => s.stationId !== startStation?.stationId)}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, newValue) => setEndStation(newValue)}
                            renderInput={(params) => <TextField {...params} label="End Station" variant="outlined" onFocus={() => setIsSelecting('end')} />}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleBookJourney}
                            disabled={isLoading || !startStation || !endStation}
                            sx={{ py: 1.5, fontWeight: 'bold' }}
                        >
                            {isLoading ? "Booking..." : "Book Journey"}
                        </Button>
                    </Box>
                    {error && (
                        <Snackbar open={true} autoHideDuration={6000} onClose={() => setError("")}>
                            <Alert onClose={() => setError("")} severity="error" sx={{ width: '100%' }}>
                                {error}
                            </Alert>
                        </Snackbar>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default Home;