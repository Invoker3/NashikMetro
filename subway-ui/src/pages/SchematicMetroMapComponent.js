import { useMemo, useRef, useEffect } from 'react';

// Data extracted from the new map.html
const stations = [
    // Line 1 (Red)
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
    // Line 2 (Blue)
    // { id: "gangapur_st", name: "Gangapur", dev: "गंगापूर", x: 500, y: 250, line: 2, interchange: true, align: 'top-left' },
    // { id: "jalapur", name: "Jalapur", dev: "जलापूर", x: 300, y: 250, line: 2, align: 'top-left' },
    // { id: "ganpati_nagar", name: "Ganpati Nagar", dev: "गणपती नगर", x: 200, y: 700, line: 2, align: 'bottom-left' },
    // { id: "satpur_colony", name: "Satpur Colony", dev: "सातपूर कॉलनी", x: 350, y: 700, line: 2, align: 'bottom' },
    // { id: "kale_nagar", name: "Kale Nagar", dev: "काळे नगर", x: 500, y: 700, line: 2, align: 'bottom' },
    // { id: "parijat_nagar", name: "Parijat Nagar", dev: "पारिजात नगर", x: 800, y: 200, line: 2, align: 'top' },
    // { id: "mico_circle", name: "MICO Circle", dev: "MICO सर्कल", x: 950, y: 200, line: 2, align: 'top' },
    // { id: "sarda_circle", name: "Sarda Circle", dev: "सारडा सर्कल", x: 1100, y: 200, line: 2, interchange: true, align: 'top-right' },
    // // Line 3 (Green)
    // { id: "mhasrul", name: "Mhasrul", dev: "म्हसरूळ", x: 1300, y: 100, line: 3, align: 'top-right' },
    // { id: "nandanvan_hills", name: "Nandanvan Hills", dev: "नंदनवन हिल्स", x: 1200, y: 100, line: 3, align: 'top' },
    // { id: "mahatmanagar", name: "Mahatmanagar", dev: "महात्मानगर", x: 650, y: 150, line: 3, align: 'top-left' },
    // { id: "city_center_mall", name: "City Center", dev: "सिटी सेंटर", x: 950, y: 750, line: 3, align: 'bottom' },
    // { id: "untwadi", name: "Untwadi", dev: "उंटवाडी", x: 1100, y: 750, line: 3, align: 'bottom' }
];

const line1Path = "M 150 400 L 850 400 L 950 450 L 950 650 L 1250 650 L 1400 700 L 1500 750";
const line2Path = "M 300 250 L 500 250 L 650 400 L 700 400 M 150 400 L 150 700 L 200 700 M 350 400 L 350 700 L 500 700 M 800 200 L 1100 200 L 1100 650";
const line3Path = "M 1300 100 L 1200 100 L 1100 200 M 500 250 C 550 150, 600 150, 650 150 L 850 150 C 950 150, 850 400, 850 400 M 950 650 L 950 750 L 1100 750 L 1100 650";

const linePathsData = {
    line1: line1Path,
    line2: line2Path,
    line3: line3Path,
};


const Station = ({ station, onStationSelect, isSelected }) => {
    let dx = 0, dy = 0;
    let textAnchor = "start";

    switch (station.align) {
        case 'left': dx = -20; textAnchor = 'end'; break;
        case 'right': dx = 20; textAnchor = 'start'; break;
        case 'top': dy = -20; textAnchor = 'middle'; break;
        case 'bottom': dy = 25; textAnchor = 'middle'; break;
        case 'top-left': dy = -15; dx = -15; textAnchor = 'end'; break;
        case 'top-right': dy = -15; dx = 15; textAnchor = 'start'; break;
        case 'bottom-left': dy = 20; dx = -15; textAnchor = 'end'; break;
        case 'bottom-right': dy = 20; dx = 15; textAnchor = 'start'; break;
        default: dx = 20; textAnchor = 'start'; break;
    }
    
    const selectionRadius = isSelected ? 12 : 0;

    return (
        <g className="station-label-group" onClick={() => onStationSelect(station)}>
            {isSelected && <circle cx={station.x} cy={station.y} r={12} fill="#fca5a5" className={`line-${station.line}`} fillOpacity="0.5"/>}
            <circle
                cx={station.x}
                cy={station.y}
                r={station.interchange ? 9 : 7}
                className={station.interchange ? 'interchange-marker' : `station-marker line-${station.line}`}
            />
            <text
                x={station.x + dx}
                y={station.y + dy}
                className="station-label-eng"
                style={{ textAnchor }}
            >
                {station.name}
            </text>
            <text
                x={station.x + dx}
                y={station.y + dy + 18}
                className="station-label-dev"
                style={{ textAnchor }}
            >
                {station.dev}
            </text>
        </g>
    );
};

// Helper function to find the closest length on an SVG path element given X, Y coordinates
const findLengthOnPath = (pathElement, x, y, granularity = 1) => {
    const totalLength = pathElement.getTotalLength();
    let minDistance = Infinity;
    let closestLength = 0;

    for (let l = 0; l <= totalLength; l += granularity) {
        const point = pathElement.getPointAtLength(l);
        const dx = point.x - x;
        const dy = point.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance) {
            minDistance = distance;
            closestLength = l;
        }
    }
    return closestLength;
};

// New component for train animation on the schematic map
const TrainAnimatorSchematic = ({ startStation, endStation, getSvgPathElement }) => {
    const trainRef = useRef(null);
    const animationFrameRef = useRef(null);
    const startTimeRef = useRef(null);
    const animationDuration = 3000; // 3 seconds for the animation (adjust as needed)

    // Effect for the actual train animation
    useEffect(() => {
        // If no valid start/end stations or train ref, hide the train and clear any animation
        if (!startStation || !endStation || !trainRef.current) {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            if (trainRef.current) {
                trainRef.current.style.display = 'none';
            }
            startTimeRef.current = null;
            return;
        }

        // Determine the common line ID (e.g., "line1", "line2")
        const commonLineId = `line${startStation.line}`;
        const linePathElement = getSvgPathElement(commonLineId);

        // Ensure both stations are on the same line and the corresponding path element exists
        if (startStation.line !== endStation.line || !linePathElement) {
            if (trainRef.current) {
                trainRef.current.style.display = 'none';
            }
            return;
        }

        // Find the length along the path for both start and end stations
        const startLength = findLengthOnPath(linePathElement, startStation.x, startStation.y);
        const endLength = findLengthOnPath(linePathElement, endStation.x, endStation.y);

        // Show the train and reset animation start time
        trainRef.current.style.display = 'block';
        startTimeRef.current = null;

        const animateTrain = (currentTime) => {
            if (!startTimeRef.current) {
                startTimeRef.current = currentTime;
            }

            const elapsedTime = currentTime - startTimeRef.current;
            let progress = Math.min(elapsedTime / animationDuration, 1); // Animation progress from 0 to 1

            // Calculate the current length along the path based on progress
            const currentPathLength = startLength + (endLength - startLength) * progress;

            // Get the X, Y coordinates on the path at the current length
            const point = linePathElement.getPointAtLength(currentPathLength);

            // Set train position (adjusting for top-left corner of the rectangle)
            trainRef.current.setAttribute('x', point.x - 10); // Subtract half of the train's width
            trainRef.current.setAttribute('y', point.y - 5);  // Subtract half of the train's height

            // If animation is not complete, request next frame
            if (progress < 1) {
                animationFrameRef.current = requestAnimationFrame(animateTrain);
            } else {
                // Animation finished: hide train and clear animation frame
                trainRef.current.style.display = 'none';
                animationFrameRef.current = null;
            }
        };

        // Start the animation
        animationFrameRef.current = requestAnimationFrame(animateTrain);

        // Cleanup function for this effect: cancel any ongoing animation frame
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [startStation, endStation, getSvgPathElement]); // Dependencies: re-run when stations or getSvgPathElement changes

    return (
        <rect
            ref={trainRef}
            width="20" // Width of the train car
            height="10" // Height of the train car
            fill="#FF5733" // A distinct orange-red color for visibility
            style={{ display: 'none', transition: 'none' }} // Ensure no CSS transitions interfere
        />
    );
};

const SchematicMapComponent = ({ onStationSelect, startStation, endStation }) => {
    const uniqueStations = useMemo(() => {
        const stationMap = new Map();
        stations.forEach(s => stationMap.set(s.id, s));
        return Array.from(stationMap.values());
    }, []);

    // Ref to store hidden SVG path elements for querying their geometry
    const svgPathElements = useRef({});
    // Ref for the actual highlighted path element
    const highlightedPathRef = useRef(null);

    // Effect to set up hidden SVG paths for querying path properties like length
    useEffect(() => {
        const svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgContainer.style.position = "absolute";
        svgContainer.style.left = "-9999px"; // Position off-screen
        svgContainer.style.top = "-9999px";
        document.body.appendChild(svgContainer); // Temporarily append to body to enable path methods

        // Create a path element for each line and store its reference
        for (const lineId in linePathsData) {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute('d', linePathsData[lineId]);
            svgContainer.appendChild(path);
            svgPathElements.current[lineId] = path;
        }

        // Cleanup function to remove the hidden SVG container
        return () => {
            document.body.removeChild(svgContainer);
        };
    }, []); // Empty dependency array: runs once on mount

    // Effect for highlighting the path segment
    useEffect(() => {
        if (startStation && endStation && startStation.line === endStation.line) {
            const lineId = `line${startStation.line}`;
            const linePathElement = svgPathElements.current[lineId];
            const fullLineD = linePathsData[lineId];

            if (!linePathElement || !highlightedPathRef.current) {
                return;
            }

            const startLen = findLengthOnPath(linePathElement, startStation.x, startStation.y);
            const endLen = findLengthOnPath(linePathElement, endStation.x, endStation.y);
            const totalLength = linePathElement.getTotalLength();

            let segmentStart, segmentEnd;
            if (startLen < endLen) {
                segmentStart = startLen;
                segmentEnd = endLen;
            } else {
                segmentStart = endLen;
                segmentEnd = startLen;
            }

            const segmentLength = segmentEnd - segmentStart;

            highlightedPathRef.current.setAttribute('d', fullLineD);
            highlightedPathRef.current.style.strokeDasharray = `${segmentLength} ${totalLength - segmentLength}`;
            highlightedPathRef.current.style.strokeDashoffset = `${-segmentStart}`; // Negative to make it appear from the start

            highlightedPathRef.current.style.display = 'block';
            highlightedPathRef.current.setAttribute('class', `line ${lineId} highlighted-line`);
        } else {
            if (highlightedPathRef.current) {
                highlightedPathRef.current.style.display = 'none';
            }
        }
    }, [startStation, endStation]); // Dependencies: re-run when stations change

    return (
        <div style={{
            width: '100%',
            height: '100%',
            overflow: 'auto',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem'
        }}>
            <style>{`
                .line { fill: none; stroke-width: 8px; stroke-linecap: round; stroke-linejoin: round; }
                .line-1 { stroke: #e63946; } /* Red */
                .line-2 { stroke: #1d3557; } /* Deep Blue */
                .line-3 { stroke: #2a9d8f; } /* Green */
                
                /* Styles for highlighted line segment */
                .highlighted-line {
                    stroke-width: 12px; /* Thicker for highlight */
                    filter: drop-shadow(0 0 5px rgba(255, 255, 0, 0.7)); /* Yellow glow */
                    transition: stroke-dashoffset 0.3s ease-out, stroke-dasharray 0.3s ease-out; /* Smooth transition */
                }

                .station-marker { stroke-width: 3px; fill: #fff; }
                .station-marker.line-1 { stroke: #e63946; }
                .station-marker.line-2 { stroke: #1d3557; }
                .station-marker.line-3 { stroke: #2a9d8f; }
                .interchange-marker { stroke-width: 4px; stroke: #343a40; fill: #fff; }
                .station-label-group { cursor: pointer; }
                .station-label-eng { font-size: 15px; font-weight: 600; fill: #212529; paint-order: stroke; stroke: #ffffff; stroke-width: 2px; }
                .station-label-dev { font-size: 13px; font-weight: 500; fill: #495057; paint-order: stroke; stroke: #ffffff; stroke-width: 2px; }
                .river { fill: #eaf6ff; stroke: none; }
                .grid-line { stroke: #e9ecef; stroke-width: 1px; }
            `}</style>
            <svg id="metro-map" viewBox="0 0 1600 900" style={{ minWidth: '1200px' }}>
                <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" className="grid-line" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3"/>
                <path className="river" d="M 0,480 L 1600,480 L 1600,600 L 0,600 Z" />

                <g id="lines">
                    <path d={line1Path} className="line line-1" />
                    {/*<path d={line2Path} className="line line-2" />*/}
                    {/*<path d={line3Path} className="line line-3" />*/}
                    {/* Highlighted segment path */}
                    <path ref={highlightedPathRef} style={{ display: 'none' }} />
                </g>
                <g id="stations">
                    {uniqueStations.map(station => (
                        <Station
                            key={station.id}
                            station={station}
                            onStationSelect={onStationSelect}
                            isSelected={startStation?.id === station.id || endStation?.id === station.id}
                        />
                    ))}
                </g>
                {/* Add the schematic train animator here, passing the getter for path data */}
                <TrainAnimatorSchematic
                    startStation={startStation}
                    endStation={endStation}
                    getSvgPathElement={(id) => svgPathElements.current[id]}
                />
            </svg>
        </div>
    );
};

export default SchematicMapComponent;