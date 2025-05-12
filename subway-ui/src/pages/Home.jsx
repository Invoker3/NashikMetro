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
    Container,
    AppBar,
    Toolbar,
    IconButton,
    Grid,
    List,
    ListItem,
    ListItemText
} from "@mui/material";
import DirectionsSubwayIcon from '@mui/icons-material/DirectionsSubway';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

const Home = ({ setAuth }) => {
    const [stations, setStations] = useState([]);
    const [startStation, setStartStation] = useState(null);
    const [endStation, setEndStation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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

    const handleLogin = () => {
        navigate("/login");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setAuth(false);
        navigate("/login");
    };

    const handleBookJourney = async () => {
        if (!startStation || !endStation || startStation === endStation) {
            alert("Please select valid start and end stations.");
            return;
        }

        setIsLoading(true);
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
        } catch (error) {
            alert(error.response?.data || "Booking failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(rgba(0,0,30,0.7), rgba(0,0,30,0.7)), url("/images/subway-background.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            pt: 8
        }}>
            <AppBar position="fixed" sx={{
                background: 'rgba(25, 118, 210, 0.95)',
                backdropFilter: 'blur(5px)'
            }}>
                <Toolbar>
                    <DirectionsSubwayIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
                        SubwayBooker
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: 'flex', gap: 3 }}>
                        <Button color="inherit">Plan Journey</Button>
                        <Button color="inherit">Status Updates</Button>
                        <Button color="inherit">Maps</Button>
                        <Button color="inherit">Fares</Button>
                        <Button color="inherit">Help</Button>
                    </Box>
                    <IconButton color="inherit" onClick={handleLogin} title="Login">
                        <LoginIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ pt: 4 }}>
                <Typography
                    variant="h3"
                    component="h1"
                    align="center"
                    sx={{
                        mb: 4,
                        color: 'white',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}
                >
                    Book Your Subway Ticket
                </Typography>

                <Paper
                    elevation={8}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TripOriginIcon color="primary" />
                            <Autocomplete
                                fullWidth
                                options={stations}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, newValue) => setStartStation(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Start Station"
                                        variant="outlined"
                                    />
                                )}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnIcon color="secondary" />
                            <Autocomplete
                                fullWidth
                                options={stations}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, newValue) => setEndStation(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select End Station"
                                        variant="outlined"
                                    />
                                )}
                            />
                        </Box>

                        <Button
                            variant="contained"
                            size="large"
                            color="primary"
                            onClick={handleBookJourney}
                            disabled={isLoading}
                            sx={{
                                mt: 2,
                                py: 1.5,
                                fontSize: '1.1rem',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.2)',
                                }
                            }}
                        >
                            {isLoading ? 'Processing...' : 'Book Journey'}
                        </Button>
                    </Box>
                </Paper>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Paper
                        elevation={4}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            maxWidth: '600px'
                        }}
                    >
                        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                            Popular Routes
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Box sx={{
                                bgcolor: '#e53935',
                                color: 'white',
                                px: 2,
                                py: 1,
                                borderRadius: 10,
                                fontWeight: 'bold'
                            }}>
                                Red Line
                            </Box>
                            <Box sx={{
                                bgcolor: '#1e88e5',
                                color: 'white',
                                px: 2,
                                py: 1,
                                borderRadius: 10,
                                fontWeight: 'bold'
                            }}>
                                Blue Line
                            </Box>
                            <Box sx={{
                                bgcolor: '#43a047',
                                color: 'white',
                                px: 2,
                                py: 1,
                                borderRadius: 10,
                                fontWeight: 'bold'
                            }}>
                                Green Line
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Container>
            <Container maxWidth="xl" sx={{ mt: 4 }}>
                {/* Status Updates Section */}
                <Paper sx={{ p: 3, mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                    <Typography variant="h6" gutterBottom>
                        Service Updates
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ 
                            p: 2, 
                            border: '1px solid #ccc', 
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Box sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                backgroundColor: 'success.main'
                            }} />
                            <Typography>Red Line: Good Service</Typography>
                        </Box>
                        {/* Add similar boxes for other lines */}
                    </Box>
                </Paper>

                {/* Quick Links Section */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                            <Typography variant="h6" gutterBottom>
                                Popular Destinations
                            </Typography>
                            <List>
                                <ListItem button>
                                    <ListItemText primary="City Center" secondary="Via Red Line" />
                                </ListItem>
                                {/* Add more destinations */}
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                            <Typography variant="h6" gutterBottom>
                                Travel Tools
                            </Typography>
                            <List>
                                <ListItem button>
                                    <ListItemText primary="Journey Planner" />
                                </ListItem>
                                <ListItem button>
                                    <ListItemText primary="Live Arrivals" />
                                </ListItem>
                                <ListItem button>
                                    <ListItemText primary="Service Updates" />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                            <Typography variant="h6" gutterBottom>
                                Help & Contact
                            </Typography>
                            <List>
                                <ListItem button>
                                    <ListItemText primary="Customer Service" />
                                </ListItem>
                                <ListItem button>
                                    <ListItemText primary="Lost & Found" />
                                </ListItem>
                                <ListItem button>
                                    <ListItemText primary="FAQs" />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Home;