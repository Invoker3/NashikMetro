import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// This is a known fix for a common issue with react-leaflet and webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// This component will handle map animations when a station is selected
const MapUpdater = ({ station }) => {
    const map = useMap();
    useEffect(() => {
        // Check if station data with coordinates is available
        if (station && station.lat && station.lon) {
            map.flyTo([station.lat, station.lon], 14, {
                animate: true,
                duration: 1.5 // Animation duration in seconds
            });
        }
    }, [station, map]);
    return null;
}

const MapComponent = ({ startStation, endStation }) => {
    // A default position for the map for when no station is selected
    const defaultPosition = [51.505, -0.09]; // London coordinates

    // The map will try to focus on the end station, then the start station
    const selectedStation = endStation || startStation;

    return (
        <MapContainer center={defaultPosition} zoom={11} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Display a marker for the start station if it's selected and has coordinates */}
            {startStation && startStation.lat && startStation.lon && (
                <Marker position={[startStation.lat, startStation.lon]}>
                    <Popup>Start: {startStation.name}</Popup>
                </Marker>
            )}
            {/* Display a marker for the end station */}
            {endStation && endStation.lat && endStation.lon && (
                <Marker position={[endStation.lat, endStation.lon]}>
                    <Popup>End: {endStation.name}</Popup>
                </Marker>
            )}
            {/* This component triggers the pan/zoom animation */}
            <MapUpdater station={selectedStation} />
        </MapContainer>
    );
};

export default MapComponent;