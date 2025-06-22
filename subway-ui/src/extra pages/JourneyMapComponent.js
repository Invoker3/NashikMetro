import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import metroLinesData from '../metro_lines_data'; // Import the new metro data

// Fix for a common react-leaflet issue with default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const INITIAL_ZOOM = 13; // Initial zoom level, zoomed out
const INITIAL_CENTER = [19.98, 73.78]; // Approximate center of your provided coordinates

// Custom hook to handle map animations and view changes
const MapEffect = ({ startStation, endStation, onMapReset }) => {
    const map = useMap();

    useEffect(() => {
        if (startStation && endStation) {
            // If both stations are selected, fit the map to their bounds
            const bounds = L.latLngBounds([
                [startStation.lat, startStation.lon],
                [endStation.lat, endStation.lon]
            ]);
            map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
        } else if (startStation || endStation) {
            // If only one station is selected, fly to it, maintaining current zoom
            const station = startStation || endStation;
            map.flyTo([station.lat, station.lon], map.getZoom(), { duration: 1.5 });
        } else {
            // If no stations are selected, reset to initial view
            map.flyTo(INITIAL_CENTER, INITIAL_ZOOM, { duration: 1.5 });
        }
    }, [startStation, endStation, map]);

    // This hook listens for map clicks to reset the view
    useMapEvents({
        click: (e) => {
            // Check if the click was on a marker. If not, reset.
            // This is a common pattern to distinguish map clicks from marker clicks
            // by checking if the target is the map container itself.
            if (e.originalEvent.target.classList.contains('leaflet-container')) {
                onMapReset(); // Call the reset function passed from parent
            }
        },
    });

    return null;
};

const JourneyMap = ({ stations, onStationSelect, startStation, endStation }) => {
    const [lines, setLines] = useState([]);

    useEffect(() => {
        const processedLines = Object.keys(metroLinesData).map(lineId => {
            const lineData = metroLinesData[lineId];
            return {
                lineId: lineId,
                color: lineData.color,
                stationIds: lineData.stations.map(s => s.id),
                path: lineData.stations.map(s => ({ lat: s.lat, lon: s.lng }))
            };
        });
        setLines(processedLines);
    }, []);

    const journeyPath = () => {
        if (!startStation || !endStation || lines.length === 0) return null;

        const line = lines.find(l =>
            l.stationIds.includes(startStation.stationId) && l.stationIds.includes(endStation.stationId)
        );

        if (!line) return null;

        const startIndex = line.stationIds.indexOf(startStation.stationId);
        const endIndex = line.stationIds.indexOf(endStation.stationId);

        if (startIndex === -1 || endIndex === -1) return null;

        const pathSegment = (startIndex < endIndex)
            ? line.path.slice(startIndex, endIndex + 1)
            : line.path.slice(endIndex, startIndex + 1).reverse();

        return { path: pathSegment.map(p => [p.lat, p.lon]), color: line.color || '#000' };
    };

    const selectedLine = journeyPath();

    // Custom station icon
    const stationIcon = L.divIcon({
        className: 'custom-station-icon',
        html: '<div style="background-color: #3f51b5; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -8]
    });

    return (
        <MapContainer center={INITIAL_CENTER} zoom={INITIAL_ZOOM} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png"
                attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {lines.map(line => (
                <Polyline
                    key={line.lineId}
                    positions={line.path.map(p => [p.lat, p.lon])}
                    color={line.color || '#808080'}
                    weight={5}
                    opacity={0.6}
                />
            ))}
            {selectedLine && (
                <Polyline
                    positions={selectedLine.path}
                    color={selectedLine.color}
                    weight={8}
                    opacity={1}
                />
            )}
            {stations.map(station => (
                <Marker
                    key={station.stationId}
                    position={[station.lat, station.lon]}
                    icon={stationIcon} // Use the custom icon
                    eventHandlers={{
                        click: () => onStationSelect(station),
                    }}
                >
                    <Popup>
                        {station.name}
                        <br />
                        <button onClick={() => onStationSelect(station, 'start')}>Set as Start</button>
                        <button onClick={() => onStationSelect(station, 'end')}>Set as End</button>
                    </Popup>
                </Marker>
            ))}
            <MapEffect startStation={startStation} endStation={endStation} onMapReset={() => onStationSelect(null)} />
        </MapContainer>
    );
};

export default JourneyMap;