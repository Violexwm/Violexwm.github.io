//Code for creating a dynamic bar chart provided by ChatGPT (OpenAI) 
//https://www.openai.com/ 2025    

        // Locations. Chicago uses the NWS API (US only); the others use Open-Meteo.
        const locations = {
            chicago: { title: 'Chicago', nwsUrl: 'https://api.weather.gov/gridpoints/LOT/38,77/forecast' }, // Chicago coordinates (38, 77)
            japan:   { title: 'Japan Tokyo', lat: 35.6762, lon: 139.6503 },
            jamaica: { title: 'Jamaica Kingston', lat: 17.9712, lon: -76.7936 },
            iceland: { title: 'Iceland Reykjavik', lat: 64.1466, lon: -21.9426 }
        };

        let weatherChart = null;  // keeps the current chart so it can be replaced

        // Fetch data for the selected location and draw the chart
        function loadForecast(key) {
            const loc = locations[key];
            document.getElementById('chartTitle').textContent = 'Temperature Forecast (' + loc.title + ')';

            let request;
            if (loc.nwsUrl) {
                // NWS API: periods are 12-hour day/night forecasts
                request = fetch(loc.nwsUrl)
                    .then(response => response.json())
                    .then(data => data.properties.periods.map(period => ({
                        time: period.startTime,
                        temp: period.temperature
                    })));
            } else {
                // Open-Meteo: hourly data in F, keep 6 AM and 6 PM to match the NWS 12-hour periods
                const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + loc.lat + '&longitude=' + loc.lon +
                    '&hourly=temperature_2m&temperature_unit=fahrenheit&timezone=auto&forecast_days=7';
                request = fetch(url)
                    .then(response => response.json())
                    .then(data => data.hourly.time
                        .map((t, i) => ({ time: t, temp: Math.round(data.hourly.temperature_2m[i]) }))
                        .filter(p => p.time.endsWith('T06:00') || p.time.endsWith('T18:00')));
            }

            request
                .then(points => {
                    const times = [];
                    const temperatures = [];
                    const colors = [];

                    // Parse data (forecast times and temperature values)
                    points.forEach(period => {
                        const formattedTime = formatTime(period.time);  // Convert time to a readable format
                        times.push(formattedTime);  // Time of forecast
                        temperatures.push(period.temp);  // Temperature value
                        colors.push(getColorForTemperature(period.temp));  // Dynamic color based on temperature
                    });

                    // Call function to create the bar chart with the data
                    createBarChart(times, temperatures, colors);
                })
                .catch(error => console.error('Error fetching weather data:', error));
        }

        document.getElementById('citySelect').addEventListener('change', e => loadForecast(e.target.value));
        loadForecast('chicago');

        // Function to format time into a more readable format
        function formatTime(isoTime) {
            const date = new Date(isoTime); // Convert ISO time to Date object
            return date.toLocaleString('en-US', {
                weekday: 'short', // Day of the week, e.g., "Mon"
                month: 'short', // Month, e.g., "Mar"
                day: 'numeric', // Day of the month, e.g., "19"
                hour: 'numeric', // Hour in numeric form, e.g., "6"
                minute: '2-digit', // Minute in 2 digits, e.g., "00"
                hour12: true // Use 12-hour format with AM/PM
            });
        }

        // Function to get the color based on temperature
        function getColorForTemperature(temperature) {
            if (temperature <= 50) {
                return "rgba(54, 162, 235, 0.7)";  // Blue for cool temperatures
            } else if (temperature <= 75) {
                return "rgba(75, 192, 192, 0.7)";  // Green for moderate temperatures
            } else {
                return "rgba(255, 99, 132, 0.7)";  // Red for hot temperatures
            }
        }

        // Function to create the bar chart using Chart.js
        function createBarChart(times, temperatures, colors) {
            const ctx = document.getElementById("weatherChart").getContext("2d");

            if (weatherChart) weatherChart.destroy();  // remove the previous chart
            weatherChart = new Chart(ctx, {
                type: 'bar',  // Bar chart type
                data: {
                    labels: times,  // X-axis: Forecast times
                    datasets: [{
                        label: "Temperature (F)",
                        data: temperatures,  // Y-axis: Temperature values
                        backgroundColor: colors,  // Dynamic colors for each bar
                        borderColor: "rgba(75, 192, 192, 1)",  // Border color (same for all bars)
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: false,  // Temperature levels won't start at 0
                        }
                    },
                    plugins: {
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                        }
                    }
                }
            });
        }