import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Container,
    InputAdornment,
    IconButton,
    Divider,
    Alert,
    Snackbar
} from "@mui/material";
import DirectionsSubwayIcon from '@mui/icons-material/DirectionsSubway';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const UserLogin = ({ setAuth }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:8080/api/users/login", { email, password });

            // Note: Storing a confirmation message like "Login Successful!" as a token
            // is not secure. This should be replaced with an actual JWT token from the backend.
            console.log("response: "+response.data.token);
            if (response.data.token.includes("Login Successful!")) {

                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userId", response.data.userId);
                localStorage.setItem("balance", response.data.balance);
                
                // This is the crucial step: update the authentication state in the App component
                setAuth(true);

                setOpenSnackbar(true);

                // Navigate to home after a short delay for better user experience
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                setError(response.data.message || "Invalid credentials");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Login failed. Please try again.");
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4
        }}>
            <Container maxWidth="sm">
                <Paper
                    elevation={8}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mb: 3
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 2
                        }}>
                            <DirectionsSubwayIcon sx={{ fontSize: 30, color: '#1976d2' }} />
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{ fontWeight: 'bold', color: '#1976d2' }}
                            >
                                SubwayBooker
                            </Typography>
                        </Box>

                        <Typography variant="h5" component="h2">
                            Welcome Back
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                            Sign in to continue to your account
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            variant="outlined"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={isLoading}
                            sx={{
                                mt: 3,
                                mb: 2,
                                py: 1.5,
                                fontSize: '1rem',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.2)',
                                }
                            }}
                        >
                            {isLoading ? 'Signing in...' : 'Login'}
                        </Button>
                    </form>

                    <Divider sx={{ my: 3 }}>
                        <Typography variant="body2" color="textSecondary">
                            OR
                        </Typography>
                    </Divider>

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body1">
                            New user?
                            <Link to="/register" style={{
                                marginLeft: '8px',
                                color: '#1976d2',
                                textDecoration: 'none',
                                fontWeight: 'medium'
                            }}>
                                Create an account
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message="Login successful!"
            />
        </Box>
    );
};

export default UserLogin;