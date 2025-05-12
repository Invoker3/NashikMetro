import { useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Paper,
    Button,
    Container,
    Divider,
    Grid,
    Card,
    CardContent,
    CardActions,
    AppBar,
    Toolbar
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsSubwayIcon from '@mui/icons-material/DirectionsSubway';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QrCodeIcon from '@mui/icons-material/QrCode';

const TicketSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const ticket = location.state?.ticket; // Get ticket details from state

    if (!ticket) {
        return (
            <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    No Ticket Found
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </Button>
            </Container>
        );
    }

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
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        SubwayBooker
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ pt: 4 }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 4
                }}>
                    <CheckCircleIcon sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
                    <Typography
                        variant="h3"
                        component="h1"
                        align="center"
                        sx={{
                            color: 'white',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                            mb: 1
                        }}
                    >
                        Ticket Successfully Booked!
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        sx={{
                            color: 'white',
                            textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
                        }}
                    >
                        Your journey is all set and ready to go
                    </Typography>
                </Box>

                <Card
                    elevation={8}
                    sx={{
                        borderRadius: 2,
                        overflow: 'visible',
                        position: 'relative',
                        maxWidth: 500,
                        mx: 'auto',
                        mb: 4,
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '8px',
                            backgroundColor: '#1976d2',
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8
                        }
                    }}
                >
                    <CardContent sx={{ pt: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                                Subway Ticket
                            </Typography>
                            <QrCodeIcon sx={{ fontSize: 40, color: '#555' }} />
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="body2" color="textSecondary">
                                    Transaction ID
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {ticket.transactionID}
                                </Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <Typography variant="body2" color="textSecondary">
                                    From
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {ticket.startStationId}
                                </Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <Typography variant="body2" color="textSecondary">
                                    To
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {ticket.endStationId}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" color="textSecondary">
                                    Date & Time
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {new Date(ticket.timestamp).toLocaleString()}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Box sx={{
                            mt: 3,
                            p: 2,
                            bgcolor: 'rgba(25, 118, 210, 0.1)',
                            borderRadius: 1,
                            border: '1px dashed rgba(25, 118, 210, 0.5)'
                        }}>
                            <Typography variant="body2" align="center">
                                Please show this ticket to the station attendant or scan at the gate
                            </Typography>
                        </Box>
                    </CardContent>

                    <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                        <Button
                            variant="contained"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate("/")}
                            sx={{ px: 4 }}
                        >
                            Back to Home
                        </Button>
                    </CardActions>
                </Card>
            </Container>
        </Box>
    );
};

export default TicketSuccess;