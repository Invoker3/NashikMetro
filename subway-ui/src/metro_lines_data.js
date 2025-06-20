const metroLinesData = {
    line1: {
        color: '#E4002B', // Example: Red color for Line 1
        stations: [
            { id: "shramik_nagar", name: "Shramik Nagar", lat: 19.9725, lng: 73.7400, interchange: true },
            { id: "satpur", name: "Satpur", lat: 19.9760, lng: 73.7450 },
            { id: "mahindra", name: "Mahindra Circle", lat: 19.9800, lng: 73.7500, interchange: true },
            { id: "1", name: "MIDC", lat: 19.9830, lng: 73.7580 },
            { id: "iti", name: "ITI Signal", lat: 19.9860, lng: 73.7650 },
            { id: "jehan_circle", name: "Jehan Circle", lat: 19.9910, lng: 73.7710, interchange: true },
            { id: "thatte_nagar", name: "Thatte Nagar", lat: 19.9935, lng: 73.7790, interchange: true },
            { id: "shivaji_nagar", name: "Shivaji Nagar", lat: 19.9950, lng: 73.7850 },
            { id: "panchavati", name: "Panchavati", lat: 19.9995, lng: 73.7920 },
            { id: "cbs", name: "CBS", lat: 19.9940, lng: 73.7880, interchange: true },
            { id: "mumbai_naka", name: "Mumbai Naka", lat: 19.9890, lng: 73.7850, interchange: true },
            { id: "2", name: "Dwarka Circle", lat: 19.9850, lng: 73.7950 },
            { id: "gayatri_nagar", name: "Gayatri Nagar", lat: 19.9820, lng: 73.8050 },
            { id: "samita_nagar", name: "Samita Nagar", lat: 19.9790, lng: 73.8150 },
            { id: "gandhi_nagar", name: "Gandhi Nagar", lat: 19.9750, lng: 73.8250 },
            { id: "nehru_nagar", name: "Nehru Nagar", lat: 19.9700, lng: 73.8320 },
            { id: "datta_mandir", name: "Datta Mandir", lat: 19.9650, lng: 73.8390 },
            { id: "nashik_road_rs", name: "Nashik Road RS", lat: 19.9580, lng: 73.8450 },
        ]
    },
    line2: {
        color: '#009B48', // Example: Green color for Line 2
        stations: [
            { id: "gangapur", name: "Gangapur", lat: 20.0080, lng: 73.7350 },
            { id: "jalapur", name: "Jalapur", lat: 19.9850, lng: 73.7380 },
            // Interchange stations need to be part of the line data for path generation
            { id: "shramik_nagar", name: "Shramik Nagar", lat: 19.9725, lng: 73.7400, interchange: true },
            { id: "mahindra", name: "Mahindra Circle", lat: 19.9800, lng: 73.7500, interchange: true },
            { id: "shaneshwar_nagar", name: "Shaneshwar Nagar", lat: 19.9650, lng: 73.7480 },
            { id: "ganpati_nagar", name: "Ganpati Nagar", lat: 19.9600, lng: 73.7550 },
            { id: "satpur_colony", name: "Satpur Colony", lat: 19.9680, lng: 73.7650 },
            { id: "kale_nagar", name: "Kale Nagar", lat: 19.9750, lng: 73.7700 },
            { id: "jehan_circle", name: "Jehan Circle", lat: 19.9910, lng: 73.7710, interchange: true },
            { id: "thatte_nagar", name: "Thatte Nagar", lat: 19.9935, lng: 73.7790, interchange: true },
            { id: "parijat_nagar", name: "Parijat Nagar", lat: 19.9990, lng: 73.7750 },
            { id: "mico_circle", name: "MICO Circle", lat: 20.0010, lng: 73.7850 },
            { id: "cbs", name: "CBS", lat: 19.9940, lng: 73.7880, interchange: true },
            { id: "sarda_circle", name: "Sarda Circle", lat: 19.9910, lng: 73.7900 },
            { id: "mumbai_naka", name: "Mumbai Naka", lat: 19.9890, lng: 73.7850, interchange: true },
        ]
    }
};

export default metroLinesData;