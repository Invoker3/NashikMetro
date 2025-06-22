import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import { useEffect, useRef, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// This is a known fix for a common issue with react-leaflet and webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom train icon - 2 cars
const trainIcon = L.divIcon({
    className: 'custom-train-icon',
    html: `
        <div style="display: flex;">
            <div style="background-color: #333; width: 20px; height: 10px; border-radius: 3px; margin-right: 2px;"></div>
            <div style="background-color: #333; width: 20px; height: 10px; border-radius: 3px;"></div>
        </div>
    `,
    iconSize: [42, 12], // Approximate size for two cars
    iconAnchor: [21, 6], // Center the icon
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

// New component for train animation
const TrainAnimator = ({ route }) => {
    const map = useMap();
    const trainMarkerRef = useRef(null);
    const animationFrameRef = useRef(null);
    const startTimeRef = useRef(null);
    const animationDuration = 5000; // 5 seconds for the animation (adjust as needed for reasonable speed)

    useEffect(() => {
        if (!route || route.length < 2) {
            // No valid route to animate, ensure train marker is removed
            if (trainMarkerRef.current) {
                map.removeLayer(trainMarkerRef.current);
                trainMarkerRef.current = null;
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            startTimeRef.current = null;
            return;
        }

        const latLngRoute = route.map(point => L.latLng(point.lat, point.lng));

        // Calculate cumulative distances along the route
        const distances = [0];
        let totalPathLength = 0;
        for (let i = 0; i < latLngRoute.length - 1; i++) {
            const segmentLength = latLngRoute[i].distanceTo(latLngRoute[i + 1]);
            totalPathLength += segmentLength;
            distances.push(totalPathLength);
        }

        // Create or update train marker
        if (!trainMarkerRef.current) {
            trainMarkerRef.current = L.marker(latLngRoute[0], { icon: trainIcon }).addTo(map);
        } else {
            trainMarkerRef.current.setLatLng(latLngRoute[0]);
        }

        startTimeRef.current = null; // Reset start time for new animation

        const animateTrain = (currentTime) => {
            if (!startTimeRef.current) {
                startTimeRef.current = currentTime;
            }

            const elapsedTime = currentTime - startTimeRef.current;
            let progress = elapsedTime / animationDuration;

            if (progress > 1) {
                progress = 1; // Animation complete
                trainMarkerRef.current.setLatLng(latLngRoute[latLngRoute.length - 1]); // Ensure it ends at the last point
                // Optionally, remove the train marker after the animation or keep it at the end station
                return;
            }

            // Find the current position along the path based on elapsed time and total path length
            const targetDistance = totalPathLength * progress;

            let segmentIndex = 0;
            for (let i = 0; i < distances.length - 1; i++) {
                if (targetDistance >= distances[i] && targetDistance <= distances[i + 1]) {
                    segmentIndex = i;
                    break;
                }
            }

            const startSegmentPoint = latLngRoute[segmentIndex];
            const endSegmentPoint = latLngRoute[segmentIndex + 1];
            const segmentStartDistance = distances[segmentIndex];
            const segmentLength = distances[segmentIndex + 1] - distances[segmentIndex];

            let segmentProgress = 0;
            if (segmentLength > 0) {
                segmentProgress = (targetDistance - segmentStartDistance) / segmentLength;
            }

            // Interpolate the latitude and longitude
            const interpolatedLat = startSegmentPoint.lat + (endSegmentPoint.lat - startSegmentPoint.lat) * segmentProgress;
            const interpolatedLng = startSegmentPoint.lng + (endSegmentPoint.lng - startSegmentPoint.lng) * segmentProgress;

            trainMarkerRef.current.setLatLng([interpolatedLat, interpolatedLng]);

            // Request the next animation frame
            animationFrameRef.current = requestAnimationFrame(animateTrain);
        };

        // Start the animation loop
        animationFrameRef.current = requestAnimationFrame(animateTrain);

        // Cleanup function for when the component unmounts or route changes
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (trainMarkerRef.current) {
                map.removeLayer(trainMarkerRef.current);
                trainMarkerRef.current = null;
            }
            startTimeRef.current = null;
        };
    }, [route, map]); // Effect re-runs when the route or map instance changes

    // Memoize the polyline positions for performance
    const polylinePositions = useMemo(() => {
        return route ? route.map(p => [p.lat, p.lng]) : [];
    }, [route]);

    return (
        <>
            {/* Draw the route polyline on the map */}
            {route && route.length > 1 && (
                <Polyline positions={polylinePositions} color="blue" weight={5} opacity={0.7} />
            )}
        </>
    );
};


const MapComponent = ({ startStation, endStation, route }) => { // Added route prop
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

            {/* Train Animation Component - renders the train and its path */}
            <TrainAnimator route={route} /> {/* Pass the route to TrainAnimator */}
        </MapContainer>
    );
};

export default MapComponent;