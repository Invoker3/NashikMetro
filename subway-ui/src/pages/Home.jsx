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
import SchematicMapComponent from './SchematicMetroMapComponent'; // Updated import

// Data for the schematic map - this would typically be in its own file
const schematicStations = [
    { id: "shramik_nagar", name: "Shramik Nagar", dev: "श्रमिक नगर", x: 150, y: 400, line: 1, interchange: true, align: 'top-left' },
    { id: "satpur", name: "Satpur", dev: "सातपूर", x: 250, y: 400, line: 1, align: 'top' },
    { id: "mahindra", name: "Mahindra", dev: "महिंद्रा", x: 350, y: 400, line: 1, interchange: true, align: 'top' },
    { id: "midc", name: "MIDC", dev: "एमआयडीसी", x: 450, y: 400, line: 1, align: 'top' },
    { id: "iti", name: "ITI Signal", dev: "आयटीआय", x: 550, y: 400, line: 1, align: 'top' },
    { id: "jehan_circle", name: "Jehan Circle", dev: "जहान सर्कल", x: 700, y: 400, line: 1, interchange: true, align: 'top' },
    { id: "canada_corner", name: "Canada Corner", dev: "कॅनडा कॉर्नर", x: 850, y: 400, line: 1, interchange: true, align: 'top' },
    { id: "panchavati", name: "Panchavati", dev: "पंचवटी", x: 950, y: 450, line: 1, align: 'bottom' },
    { id: "cbs", name: "CBS", dev: "सीबीएस", x: 950, y: 650, line: 1, interchange: true, align: 'left' },
    { id: "mumbai_naka", name: "Mumbai Naka", dev: "मुंबई नाका", x: 1100, y: 650, line: 1, interchange: true, align: 'bottom' },
    { id: "dwarka_circle", name: "Dwarka Circle", dev: "द्वारका सर्कल", x: 1250, y: 650, line: 1, align: 'bottom' },
    { id: "gandhi_nagar", name: "Gandhi Nagar", dev: "गांधी नगर", x: 1400, y: 700, line: 1, align: 'right' },
    { id: "nashik_road_rs", name: "Nashik Road RS", dev: "नाशिक रोड रे.स्टे.", x: 1500, y: 750, line: 1, align: 'right' },
    { id: "gangapur_st", name: "Gangapur", dev: "गंगापूर", x: 500, y: 250, line: 2, interchange: true, align: 'top-left' },
    { id: "jalapur", name: "Jalapur", dev: "जलापूर", x: 300, y: 250, line: 2, align: 'top-left' },
    { id: "ganpati_nagar", name: "Ganpati Nagar", dev: "गणपती नगर", x: 200, y: 700, line: 2, align: 'bottom-left' },
    { id: "satpur_colony", name: "Satpur Colony", dev: "सातपूर कॉलनी", x: 350, y: 700, line: 2, align: 'bottom' },
    { id: "kale_nagar", name: "Kale Nagar", dev: "काळे नगर", x: 500, y: 700, line: 2, align: 'bottom' },
    { id: "parijat_nagar", name: "Parijat Nagar", dev: "पारिजात नगर", x: 800, y: 200, line: 2, align: 'top' },
    { id: "mico_circle", name: "MICO Circle", dev: "MICO सर्कल", x: 950, y: 200, line: 2, align: 'top' },
    { id: "sarda_circle", name: "Sarda Circle", dev: "सारडा सर्कल", x: 1100, y: 200, line: 2, interchange: true, align: 'top-right' },
    { id: "mhasrul", name: "Mhasrul", dev: "म्हसरूळ", x: 1300, y: 100, line: 3, align: 'top-right' },
    { id: "nandanvan_hills", name: "Nandanvan Hills", dev: "नंदनवन हिल्स", x: 1200, y: 100, line: 3, align: 'top' },
    { id: "mahatmanagar", name: "Mahatmanagar", dev: "महात्मानगर", x: 650, y: 150, line: 3, align: 'top-left' },
    { id: "city_center_mall", name: "City Center", dev: "सिटी सेंटर", x: 950, y: 750, line: 3, align: 'bottom' },
    { id: "untwadi", name: "Untwadi", dev: "उंटवाडी", x: 1100, y: 750, line: 3, align: 'bottom' }
];

const Home = ({ isAuthenticated, setAuth }) => {
    const [stations, setStations] = useState([]);
    const [startStation, setStartStation] = useState(null);
    const [endStation, setEndStation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSelecting, setIsSelecting] = useState('start');
    const navigate = useNavigate();

    useEffect(() => {
        // Use the station data from the schematic map
        const allStationsMap = new Map();
        schematicStations.forEach(station => {
            if (!allStationsMap.has(station.id)) {
                allStationsMap.set(station.id, {
                    // Keep original data plus a 'stationId' for consistency if needed elsewhere
                    ...station,
                    stationId: station.id,
                });
            }
        });
        setStations(Array.from(allStationsMap.values()));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setAuth(false);
    };

    const handleMapStationSelect = (station) => {
        if (isSelecting === 'start') {
            setStartStation(station);
            setIsSelecting('end'); // Auto-advance to selecting the end station
        } else {
            setEndStation(station);
            setIsSelecting('start'); // Reset to start for the next selection
        }
    };

    const handleBookJourney = async () => {
        if (!startStation || !endStation) {
            setError("Please select both a start and end station.");
            return;
        }
        if (startStation.id === endStation.id) {
            setError("Start and end stations cannot be the same.");
            return;
        }

        setIsLoading(true);
        setError("");
        try {
            const response = await axios.post(
                "http://localhost:8080/api/users/purchase-ticket",
                {
                    userId: localStorage.getItem("userId"),
                    startStationId: startStation.id, // Use id from schematic data
                    endStationId: endStation.id,   // Use id from schematic data
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
            
            <Box sx={{ position: 'relative', flexGrow: 1, p: 2, display: 'flex' }}>
                <Paper
                    elevation={8}
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 1000,
                        width: '100%',
                        maxWidth: '450px',
                        mr: 2
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
                            options={stations.filter(s => s.id !== startStation?.id)}
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
                 <Box sx={{ flexGrow: 1, position: 'relative' }}>
                    <SchematicMapComponent
                        onStationSelect={handleMapStationSelect}
                        startStation={startStation}
                        endStation={endStation}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Home;