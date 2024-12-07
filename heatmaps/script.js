// Initialize the map
var map = L.map('map').setView([40.7128, -74.0060], 12);  // Centered on NYC (latitude, longitude)

// Add tile layer (you can use other free map providers, like OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Array to hold the heatmap data points
var heatData = [];

// Function to load and parse the CSV file
function loadCSVData() {
    // Use PapaParse to fetch and parse the CSV file
    Papa.parse('nypd_map.csv', {
        download: true,
        header: true,  // Assuming the CSV has headers
        dynamicTyping: true,  // Automatically convert numbers
        complete: function(results) {
            // Process the parsed CSV data
            processCSVData(results.data);
        },
        error: function(error) {
            console.error("Error parsing CSV:", error);
        }
    });
}

// Function to process the parsed CSV data
function processCSVData(data) {
    // Loop through each row of the CSV data
    data.forEach(function(row) {
        // Assuming the CSV has 'latitude' and 'longitude' columns
        var lat = row.latitude;
        var lon = row.longitude;
        var intensity = row.intensity || 0.5;  // Default intensity if not provided

        // Only add data points if lat and lon are available
        if (lat && lon) {
            heatData.push([lat, lon, intensity]);
        }
    });

    // Once the data is processed, add the heatmap layer to the map
    addHeatmapLayer();
}

// Function to add the heatmap layer to the map
function addHeatmapLayer() {
    L.heatLayer(heatData, {
        radius: 25,   // Radius of each point
        blur: 15,     // How much the heat fades out
        maxZoom: 17   // Maximum zoom level
    }).addTo(map);
}

// Load and process the CSV data
loadCSVData();
